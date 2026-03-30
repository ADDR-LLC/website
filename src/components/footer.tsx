"use client";

import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import { useState, Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer
      className="w-full relative overflow-hidden bg-[#000000] border-t border-[#2C2C2E] text-[#888888] py-12 px-4 md:px-12 lg:px-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-[#000000]" />}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
          <Dithering
            colorBack="#00000000"
            colorFront="#0aa0f1ff"
            shape="warp"
            type="4x4"
            speed={isHovered ? 0.6 : 0.2}
            className="w-full h-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Link href="/#home" className="text-[#95bdc9] font-bold text-2xl tracking-widest hover:text-white transition-colors">
              ADDR
            </Link>
            <p className="text-sm font-light mt-2 max-w-sm text-[#a0a0a5]">
              Advanced Design Development & Research. <br />
              Building smarter systems for smarter solutions since 2024.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* <Link href="mailto:contact@addr.com" className="hover:text-[#95bdc9] hover:scale-110 transition-all duration-300">
              <Mail className="w-6 h-6" />
            </Link> */}
            {/* <Link href="/" className="hover:text-[#95bdc9] hover:scale-110 transition-all duration-300">
              <Globe className="w-6 h-6" />
            </Link> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#1a1a1c] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs w-full">
          <p className="font-mono tracking-wider text-center md:text-left w-full">&copy; {currentYear} ADDR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
