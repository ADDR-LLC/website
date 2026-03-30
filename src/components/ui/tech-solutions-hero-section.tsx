"use client";

import React, { useEffect, useState } from "react";
import { RaycastAnimatedBlueBackground } from "./raycast-animated-blue-background";

interface TechHeroProps {
  title?: string;
  subtitle?: string;
  statLabel?: string;
  statValue?: string;
}

export function TechSolutionsHeroSection({
  title = "ADDR",
  subtitle = "Advanced Design Development & Research",
  statLabel = "SMARTER SYSTEMS",
  statValue = "FOR SMARTER SOLUTIONS",
}: TechHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col items-start justify-center overflow-hidden bg-[#000000] text-white px-4 py-12 md:px-12 lg:px-24">
      {mounted && <RaycastAnimatedBlueBackground />}

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start justify-center h-full flex-grow py-8">
        <div className={`flex flex-col items-start text-left mt-12 md:mt-24 transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"} animate-in fade-in`}>
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e8e8e8] to-[#95bdc9] drop-shadow-[0_0_20px_rgba(126,227,135,0.2)]">
            {title}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-[#95bdc9] tracking-widest font-light max-w-2xl uppercase">
            {subtitle}
          </p>

          <div className="mt-16 border-l-2 border-[#505050] pl-6 transition-opacity duration-1000 delay-500">
            <span className="block text-sm text-[#484e58] tracking-widest font-mono">{statLabel}</span>
            <span className="block text-lg font-bold text-[#e8e8e8] tracking-widest mt-2">{statValue}</span>
          </div>
        </div>
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[rgba(126,227,135,0.05)] rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[rgba(150,230,160,0.05)] rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
    </div>
  );
}
