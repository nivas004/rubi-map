'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

/**
 * RUBI Interconnected Map — Desktop & Mobile
 * - Desktop: hover a main petal → shows sub-petals + connector lines (with grace delay)
 * - Mobile/Touch: tap a main petal to toggle its sub-petals; tap a sub-petal to focus + dim others
 * - Tap empty canvas to clear focus/close groups
 * - Keyboard: Tab/Enter/Space work on petals & sub-petals
 * - Responsive: SVG scales to screen via viewBox
 */

// --- Data -----------------------------------------------------------------
const CORE = {
  id: "Identity Layer",
  subtitle: "PHC + Web-of-Trust (FPP/SSI)",
  color: "#ea580c",
  desc:
    "A cryptographic foundation enabling one-per-person digital identity with privacy-preserving verification. PHC ensures authentic personhood while Web-of-Trust allows portable reputation and community vouching.",
};

const RUBI = {
  id: "RUBI",
  subtitle: "Retroactive Universal Basic Income",
  color: "#db2777",
  desc:
    "Fraud-resistant universal income distribution using PHC to ensure one payment per person, creating economic inclusion and local demand stimulus.",
};

// Main ring
const PETALS = [
  { id: "Digital Governance & Technology Policy", color: "#06b6d4", desc: "Secure citizen authentication for all government services with privacy-preserving credential verification" },
  { id: "Democracy & Electoral Systems", color: "#22c55e", desc: "Tamper-proof voting systems ensuring one person = one vote with cryptographic verifiability" },
  { id: "Cybersecurity & Digital Economy", color: "#22d3ee", desc: "Fraud-resistant identity verification preventing SIM swapping and critical infrastructure attacks" },
  { id: "Science & Research Integrity", color: "#93c5fd", desc: "Verifiable research attribution and AI accountability with human oversight requirements" },
  { id: "Education & Global Credentials", color: "#14b8a6", desc: "Portable, tamper-proof educational credentials recognized worldwide" },
  { id: "Healthcare & Medical Records", color: "#84cc16", desc: "Patient-controlled health data with selective privacy-preserving sharing" },
  { id: "Migration & Humanitarian Aid", color: "#a855f7", desc: "Portable identity for displaced populations enabling rapid, accurate aid distribution" },
  { id: "Financial Inclusion & Banking", color: "#f59e0b", desc: "Streamlined KYC compliance and fraud prevention for universal financial access" },
  { id: "Social Protection & Benefits", color: "#60a5fa", desc: "Ghost-free benefit distribution with community vouching for undocumented populations" },
  { id: "Supply Chain & Trade Verification", color: "#8b5cf6", desc: "End-to-end product authenticity and sustainable sourcing verification" },
  { id: "Climate Action & Carbon Markets", color: "#10b981", desc: "Verified environmental actions and direct climate dividend distribution" },
  { id: "Emergency Response & Disaster Relief", color: "#eab308", desc: "Rapid, fraud-resistant aid distribution during crises using social trust networks" },
];

// Primary links to RUBI
const RUBI_LINKS = new Set([
  "Financial Inclusion & Banking",
  "Social Protection & Benefits",
  "Climate Action & Carbon Markets",
  "Emergency Response & Disaster Relief",
  "Education & Global Credentials",
  "Supply Chain & Trade Verification",
]);

// Sub-petals
const SUBS = {
  "Digital Governance & Technology Policy": [
    { id: "Citizen Digital Identity", desc: "Self-sovereign government service access" },
    { id: "Privacy-Preserving Verification", desc: "Prove age/residency without data exposure" },
  ],
  "Democracy & Electoral Systems": [
    { id: "Cryptographic Voting", desc: "End-to-end verifiable digital elections" },
    { id: "Voter Authentication", desc: "Anonymous yet verified democratic participation" },
  ],
  "Cybersecurity & Digital Economy": [
    { id: "Anti-Fraud Protection", desc: "Cryptographic defense against identity theft" },
    { id: "Zero-Trust Verification", desc: "Secure authentication for critical systems" },
  ],
  "Science & Research Integrity": [
    { id: "Research Attribution", desc: "Tamper-proof credit for scientific contributions" },
    { id: "AI Safety Gates", desc: "Human oversight for high-risk technology releases" },
  ],
  "Education & Global Credentials": [
    { id: "Global Diploma Verification", desc: "Instant worldwide credential authentication" },
    { id: "Skills Portability", desc: "Verified competencies that travel with learners" },
  ],
  "Healthcare & Medical Records": [
    { id: "Medical Record Portability", desc: "Health data follows the patient securely" },
    { id: "Vaccination Credentials", desc: "Prove health status without full record exposure" },
  ],
  "Migration & Humanitarian Aid": [
    { id: "Refugee Identity", desc: "Cryptographically verified identity for stateless persons" },
    { id: "Cross-Border Services", desc: "Portable records across international boundaries" },
  ],
  "Financial Inclusion & Banking": [
    { id: "Reusable KYC", desc: "One-time verification, multiple service access" },
    { id: "Financial Fraud Prevention", desc: "Cryptographic identity verification" },
  ],
  "Social Protection & Benefits": [
    { id: "Duplicate-Free Distribution", desc: "One credential = one benefit allocation" },
    { id: "Community Attestation", desc: "Trusted local vouching for vulnerable populations" },
  ],
  "Supply Chain & Trade Verification": [
    { id: "Product Authenticity", desc: "Cryptographic proof against counterfeiting" },
    { id: "Sustainability Tracking", desc: "Verifiable environmental and ethical sourcing" },
  ],
  "Climate Action & Carbon Markets": [
    { id: "Carbon Credit Verification", desc: "Tamper-proof environmental impact tracking" },
    { id: "Climate Payments", desc: "Direct distribution of environmental dividends" },
  ],
  "Emergency Response & Disaster Relief": [
    { id: "Crisis Aid Routing", desc: "Trusted network-based emergency assistance" },
    { id: "Disaster Payment Systems", desc: "Resilient identity verification during outages" },
  ],
};

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

export default function Home() {
  const [selected, setSelected] = useState<any>(null);
  const [activePetalId, setActivePetalId] = useState<string|null>(null);
  const [focusedSubKey, setFocusedSubKey] = useState<string|null>(null);
  const leaveTimer = useRef<any>(null);
  const { hoverCapable, coarsePointer } = useInputCapabilities();

  const W = 1200;
  const H = 800;
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
      const subs = (SUBS as any)[p.id] || [];
      const base = (layout as any)[p.id];
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      <style>{`
        .focus-ring:focus-visible { outline: 3px solid #f472b6; outline-offset: 2px; border-radius: 10px; }
        text.label { pointer-events: none; }
      `}</style>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
        Retroactive UBI: <span className="text-fuchsia-400">The Interconnected Map</span>
      </h1>
      <p className="text-center max-w-4xl mb-8 text-lg text-slate-300">
        Hover a policy node to reveal concrete <span className="font-semibold">PHC/FPP</span> and <span className="font-semibold">RUBI</span> use-cases.
        Click or tap any node for details; clicking a sub-node will focus it.
      </p>

      <div className="w-full max-w-[1200px] overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block select-none"
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
              x1={(layout as any).core.x}
              y1={(layout as any).core.y}
              x2={(layout as any)[p.id].x}
              y2={(layout as any)[p.id].y}
              stroke="#475569"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={globalStrokeDim}
            />
          ))}

          <line
            x1={(layout as any).core.x}
            y1={(layout as any).core.y}
            x2={(layout as any).rubi.x}
            y2={(layout as any).rubi.y}
            stroke={RUBI.color}
            strokeWidth={2}
            opacity={globalStrokeDim}
          />
          {PETALS.filter((p) => RUBI_LINKS.has(p.id)).map((p) => (
            <line
              key={`rubi-${p.id}`}
              x1={(layout as any).rubi.x}
              y1={(layout as any).rubi.y}
              x2={(layout as any)[p.id].x}
              y2={(layout as any)[p.id].y}
              stroke={RUBI.color}
              strokeOpacity={0.6 * globalStrokeDim}
              strokeWidth={1.5}
            />
          ))}

          <circle
            cx={(layout as any).core.x}
            cy={(layout as any).core.y}
            r={outerR}
            fill="none"
            stroke="#1f2937"
            strokeDasharray="4 6"
            opacity={globalStrokeDim}
          />

          <g>
            <rect
              x={(layout as any).core.x - 150}
              y={(layout as any).core.y - 60}
              width={300}
              height={120}
              rx={18}
              fill="#0b1220"
              stroke={CORE.color}
              strokeWidth={2}
            />
            <text x={(layout as any).core.x} y={(layout as any).core.y - 8} textAnchor="middle" style={{ fill: "#fff", fontSize: 18, fontWeight: 700 }} className="label">
              {CORE.id}
            </text>
            <text x={(layout as any).core.x} y={(layout as any).core.y + 18} textAnchor="middle" style={{ fill: "#cbd5e1", fontSize: 13 }} className="label">
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
            <circle cx={(layout as any).rubi.x} cy={(layout as any).rubi.y} r={36} fill="#2a0f1f" stroke={RUBI.color} strokeWidth={2} />
            <text x={(layout as any).rubi.x} y={(layout as any).rubi.y - 2} textAnchor="middle" style={{ fill: "#fff", fontSize: 16 }} className="label">RUBI</text>
            <text x={(layout as any).rubi.x} y={(layout as any).rubi.y + 16} textAnchor="middle" style={{ fill: "#f5a6cb", fontSize: 11 }} className="label">baseline</text>
          </g>

          {PETALS.map((p) => {
            const subs = (SUBS as any)[p.id] || [];
            const subsPos = (subLayouts as any)[p.id] || [];
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
                  <circle cx={(layout as any)[p.id].x} cy={(layout as any)[p.id].y} r={PETAL_R} fill="#0f172a" stroke={p.color} strokeWidth={2} />
                  <text
                    x={(layout as any)[p.id].x}
                    y={(layout as any)[p.id].y - (PETAL_R + 8)}
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
                        x1={(layout as any)[p.id].x}
                        y1={(layout as any)[p.id].y}
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-3xl bg-slate-900/70 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="text-slate-300 mt-1" size={18} />
          <div>
            <div className="text-slate-200 text-lg font-semibold">
              {selected ? (selected.group ? `${selected.group} → ${selected.id}` : selected.id) : `${CORE.id} → ${RUBI.id}`}
            </div>
            <div className="text-slate-400 text-sm mt-1 leading-relaxed">
              {selected ? (selected.desc || "") : "Identity rails (PHC + FPP) make one-per-human fairness possible; RUBI then delivers universal, circulating support. Hover or tap a node to explore sub-use-cases; click/tap to focus."}
            </div>
          </div>
        </div>
      </motion.div>

      <footer className="mt-8 text-xs text-slate-500 text-center max-w-2xl">
        Built with privacy-first identity principles. Questions / collab: <span className="underline">hello@retroactiveubi.com</span>
      </footer>
    </div>
  );
}

