'use client';

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import to avoid SSR issues with window
const MapDesktop = dynamic(() => import("./components/MapDesktop"), { ssr: false });
const MapMobile = dynamic(() => import("./components/MapMobile"), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      <style>{`
        .focus-ring:focus-visible { outline: 3px solid #f472b6; outline-offset: 2px; border-radius: 10px; }
        text.label { pointer-events: none; }
        @media (max-width: 375px) {
          .rubi-header { flex-direction: column; gap: 0.5rem; align-items: stretch; }
          .rubi-header-link { width: 100%; justify-content: center; }
        }
      `}</style>
      {/* Header with Guidebook link */}
      <header className="w-full max-w-4xl mb-6 flex items-center justify-between rubi-header">
        <span className="text-2xl font-bold tracking-tight text-fuchsia-400 block" aria-label="Retroactive UBI Home">
          retroactiveubi.com
        </span>
        <nav>
          <a
            href="/guidebook"
            className="rubi-header-link inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 text-white font-semibold text-base shadow transition-colors"
            style={{ minWidth: 120, textAlign: "center" }}
            aria-label="Open the Guidebook"
          >
            Guidebook
          </a>
        </nav>
      </header>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
        Retroactive UBI: <span className="text-fuchsia-400">Interactive Policy Map</span>
      </h1>
      <p className="text-center max-w-4xl mb-4 text-lg text-slate-300">
        Hover a policy node to reveal concrete <span className="font-semibold">PHC/FPP</span> and <span className="font-semibold">RUBI</span> use-cases.
        Click or tap any node for details; clicking a sub-node will focus it.
      </p>
      <div
        className="w-full max-w-[1200px] flex justify-center items-start"
        style={{ minHeight: 650, marginTop: 0 }}
      >
        {isMobile ? <MapMobile /> : <MapDesktop />}
      </div>
      <footer className="mt-8 text-xs text-slate-500 text-center max-w-2xl">
        Built with privacy-first identity principles. Questions / collab: <span className="underline">hello@retroactiveubi.com</span>
      </footer>
    </div>
  );
}

