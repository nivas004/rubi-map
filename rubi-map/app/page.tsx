import React from "react";
import dynamic from "next/dynamic";

const MapDesktop = dynamic(() => import("./components/MapDesktop"), { ssr: false });
const MapMobile = dynamic(() => import("./components/MapMobile"), { ssr: false });

const Home = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      {isMobile ? <MapMobile /> : <MapDesktop />}
    </div>
  );
};

export default Home;