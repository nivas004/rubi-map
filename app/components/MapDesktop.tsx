'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { CORE, RUBI, PETALS, RUBI_LINKS, SUBS } from "./mapData";

// --- Hooks & Helpers ------------------------------------------------------
function useInputCapabilities() {
  const [hoverCapable, setHoverCapable] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const onHover = () => setHoverCapable(mqHover.matches);
    const onCoarse = () => setCoarsePointer(mqCoarse.matches);
    onHover();
    onCoarse();
    mqHover.addEventListener("change", onHover);
    mqCoarse.addEventListener("change", onCoarse);
    return () => {
      mqHover.removeEventListener("change", onHover);
      mqCoarse.removeEventListener("change", onCoarse);
    };
  }, []);
  return { hoverCapable, coarsePointer };
}

function polar(cx: number, cy: number, r: number, theta: number) {
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

function fanPositions(center: {x:number;y:number}, baseAngle: number, baseR: number, count: number, fan = 0.26, rOffset = 90) {
  const positions: Array<{x:number;y:number;angle:number}> = [];
  const start = -((count - 1) / 2) * fan;
  for (let i = 0; i < count; i++) {
    const a = baseAngle + start + i * fan;
    const p = polar(center.x, center.y, baseR + rOffset, a);
    positions.push({ ...p, angle: a });
  }
  return positions;
}

export default function MapDesktop() {
  const [selected, setSelected] = useState<any>(null);
  const [activePetalId, setActivePetalId] = useState<string|null>(null);
  const [focusedSubKey, setFocusedSubKey] = useState<string|null>(null);
  const leaveTimer = useRef<any>(null);
  const { hoverCapable, coarsePointer } = useInputCapabilities();

  const W = 1200;
  const H = 700; // Reduced height for tighter fit
  const center = { x: W / 2, y: H / 2 };
  const innerR = 120;
  const outerR = 300;

  const layout = useMemo(() => {
    const pos: Record<string, {x:number;y:number;angle?:number}> = {};
    pos.core = { ...center };
    pos.rubi = polar(center.x, center.y, innerR, Math.PI / 2);
    const n = PETALS.length;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const key = PETALS[i].id;
      pos[key] = { ...polar(center.x, center.y, outerR, angle), angle };
    }
    return pos;
  }, []);

  const subLayouts = useMemo(() => {
    const out: Record<string, Array<{x:number;y:number;angle:number}>> = {};
    for (const p of PETALS) {
      const subs = SUBS[p.id] || [];
      const base = layout[p.id];
      if (!base) continue;
      out[p.id] = fanPositions(center, base.angle!, outerR, subs.length, 0.28, 95);
    }
    return out;
  }, [layout]);

  const handleGroupEnter = (id: string) => {
    if (!hoverCapable) return;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActivePetalId(id);
  };

  const handleGroupLeave = (id: string) => {
    if (!hoverCapable) return;
    if (activePetalId !== id) return;
    leaveTimer.current = setTimeout(() => {
      setActivePetalId(null);
      setFocusedSubKey(null);
    }, 260);
  };

  const keyIsActivate = (e: React.KeyboardEvent) => e.key === "Enter" || e.key === " ";

  const activePetalFromFocus = focusedSubKey ? focusedSubKey.split("::")[0] : null;
  const dimForMain = (petalId: string) => {
    if (!focusedSubKey) return 1;
    return petalId === activePetalFromFocus ? 0.6 : 0.25;
  };
  const dimForSub = (subKey: string) => {
    if (!focusedSubKey) return 1;
    if (subKey === focusedSubKey) return 1;
    const samePetal = subKey.split("::")[0] === activePetalFromFocus;
    return samePetal ? 0.45 : 0.25;
  };
  const globalStrokeDim = focusedSubKey ? 0.35 : 1;

  const SUB_R = coarsePointer ? 22 : 18;
  const PETAL_R = coarsePointer ? 30 : 26;

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-row gap-8 justify-center items-start" style={{ minHeight: 700 }}>
      <style>{`
        .focus-ring:focus-visible { outline: 3px solid #f472b6 !important; outline-offset: 2px; border-radius: 10px; }
        text.label { pointer-events: none; }
        svg *:focus { outline: none !important; }
        @media (max-width: 1200px) {
          .map-desktop-svg { width: 650px !important; height: 400px !important; }
          .info-panel-desktop { max-width: 350px !important; min-width: 220px !important; }
        }
        @media (max-width: 900px) {
          .map-desktop-svg { width: 100vw !important; height: 300px !important; }
          .info-panel-desktop { display: none !important; }
        }
      `}</style>
      {/* Left: SVG Map */}
      <div className="flex flex-col justify-start items-center flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="800"
          height="600"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block select-none map-desktop-svg"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePetalId(null);
              setFocusedSubKey(null);
            }
          }}
        >
          <rect x={0} y={0} width={W} height={H} fill="transparent" />

          {PETALS.map((p) => (
            <line
              key={`core-${p.id}`}
              x1={layout.core.x}
              y1={layout.core.y}
              x2={layout[p.id].x}
              y2={layout[p.id].y}
              stroke="#475569"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={globalStrokeDim}
            />
          ))}

          <line
            x1={layout.core.x}
            y1={layout.core.y}
            x2={layout.rubi.x}
            y2={layout.rubi.y}
            stroke={RUBI.color}
            strokeWidth={2}
            opacity={globalStrokeDim}
          />
          {PETALS.filter((p) => RUBI_LINKS.has(p.id)).map((p) => (
            <line
              key={`rubi-${p.id}`}
              x1={layout.rubi.x}
              y1={layout.rubi.y}
              x2={layout[p.id].x}
              y2={layout[p.id].y}
              stroke={RUBI.color}
              strokeOpacity={0.6 * globalStrokeDim}
              strokeWidth={1.5}
            />
          ))}

          <circle
            cx={layout.core.x}
            cy={layout.core.y}
            r={outerR}
            fill="none"
            stroke="#1f2937"
            strokeDasharray="4 6"
            opacity={globalStrokeDim}
          />

          <g>
            <rect
              x={layout.core.x - 150}
              y={layout.core.y - 60}
              width={300}
              height={120}
              rx={18}
              fill="#0b1220"
              stroke={CORE.color}
              strokeWidth={2}
            />
            <text x={layout.core.x} y={layout.core.y - 8} textAnchor="middle" style={{ fill: "#fff", fontSize: 18, fontWeight: 700 }} className="label">
              {CORE.id}
            </text>
            <text x={layout.core.x} y={layout.core.y + 18} textAnchor="middle" style={{ fill: "#cbd5e1", fontSize: 13 }} className="label">
              {CORE.subtitle}
            </text>
          </g>

          <g
            role="button"
            tabIndex={0}
            aria-label="RUBI"
            onKeyDown={(e) => { if (keyIsActivate(e)) { setSelected(RUBI); setFocusedSubKey(null); } }}
            onClick={() => { setSelected(RUBI); setFocusedSubKey(null); }}
            className="cursor-pointer focus-ring"
          >
            <circle cx={layout.rubi.x} cy={layout.rubi.y} r={36} fill="#2a0f1f" stroke={RUBI.color} strokeWidth={2} />
            <text x={layout.rubi.x} y={layout.rubi.y - 2} textAnchor="middle" style={{ fill: "#fff", fontSize: 16 }} className="label">RUBI</text>
            <text x={layout.rubi.x} y={layout.rubi.y + 16} textAnchor="middle" style={{ fill: "#f5a6cb", fontSize: 11 }} className="label">baseline</text>
          </g>

          {PETALS.map((p) => {
            const subs = SUBS[p.id] || [];
            const subsPos = subLayouts[p.id] || [];
            const isActive = activePetalId === p.id;
            const petalOpacity = dimForMain(p.id);

            const onPetalClick = () => {
              if (!hoverCapable) {
                setActivePetalId((prev) => (prev === p.id ? null : p.id));
                setFocusedSubKey(null);
              } else {
                setSelected(p);
                setFocusedSubKey(null);
              }
            };

            return (
              <g
                key={`group-${p.id}`}
                onMouseEnter={() => handleGroupEnter(p.id)}
                onMouseLeave={() => handleGroupLeave(p.id)}
              >
                <motion.g
                  role="button"
                  tabIndex={0}
                  aria-label={p.id}
                  aria-expanded={isActive}
                  whileHover={hoverCapable ? { scale: 1.06 } : undefined}
                  onKeyDown={(e) => { if (keyIsActivate(e)) onPetalClick(); }}
                  onClick={onPetalClick}
                  className="cursor-pointer focus-ring"
                  style={{ opacity: petalOpacity }}
                >
                  <circle cx={layout[p.id].x} cy={layout[p.id].y} r={PETAL_R} fill="#0f172a" stroke={p.color} strokeWidth={2} />
                  <text
                    x={layout[p.id].x}
                    y={layout[p.id].y - (PETAL_R + 8)}
                    textAnchor="middle"
                    style={{ fill: p.color, fontSize: 12, fontWeight: 700 }}
                    className="label"
                  >
                    {p.id}
                  </text>
                </motion.g>

                {isActive && subs.map((s: any, i: number) => {
                  const pos = subsPos[i];
                  if (!pos) return null;
                  const subKey = `${p.id}::${s.id}`;
                  const dim = dimForSub(subKey);
                  const isFocused = focusedSubKey === subKey;

                  const onSubClick = () => {
                    setSelected({ ...s, group: p.id });
                    setFocusedSubKey(subKey);
                  };

                  return (
                    <g
                      key={subKey}
                      role="button"
                      tabIndex={0}
                      aria-label={`${p.id} → ${s.id}`}
                      className="cursor-pointer focus-ring"
                      onKeyDown={(e) => { if (keyIsActivate(e)) onSubClick(); }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubClick();
                      }}
                    >
                      <line
                        x1={layout[p.id].x}
                        y1={layout[p.id].y}
                        x2={pos.x}
                        y2={pos.y}
                        stroke={p.color}
                        strokeWidth={isFocused ? 2.6 : 1.6}
                        strokeOpacity={0.8 * dim}
                      />
                      <motion.circle
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        cx={pos.x}
                        cy={pos.y}
                        r={SUB_R}
                        fill="#0b1220"
                        stroke={p.color}
                        strokeWidth={isFocused ? 3 : 2}
                        style={{ opacity: dim }}
                      />
                      <motion.text
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        x={pos.x}
                        y={pos.y - (SUB_R + 6)}
                        textAnchor="middle"
                        style={{ fill: p.color, fontSize: 11, fontWeight: 700, opacity: dim }}
                        className="label"
                      >
                        {s.id}
                      </motion.text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Right: Info Panel */}
      <div className="flex flex-col justify-start items-start flex-shrink-0 info-panel-desktop" style={{ minWidth: 380, maxWidth: 480 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 border border-slate-700 rounded-2xl p-5 w-full"
          style={{
            minHeight: 90,
            height: 110,
            transition: "height 0.2s",
            boxShadow: "0 4px 32px 0 #0004",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <Info className="text-slate-300 mt-1" size={18} />
          <div>
            <div className="text-slate-200 text-lg font-semibold">
              {selected ? (selected.group ? `${selected.group} → ${selected.id}` : selected.id) : `${CORE.id} → ${RUBI.id}`}
            </div>
            <div className="text-slate-400 text-sm mt-1 leading-relaxed">
              {selected ? (selected.desc || "") : "Identity rails (PHC + FPP) make one-per-human fairness possible; RUBI then delivers universal, circulating support. Hover or tap a node to explore sub-use-cases; click/tap to focus."}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
