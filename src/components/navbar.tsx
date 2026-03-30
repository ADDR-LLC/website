"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", href: "/#home", id: "home" },
    { name: "About", href: "/#about", id: "about" },
    { name: "Blog", href: "/blog", id: "blog" },
  ];

  // Logic to highlight active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          if (section.offsetTop <= scrollPosition) {
            setActiveSection(navLinks[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-md border-b border-[#505050]/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full relative">
          
          <div className="hidden md:flex w-full justify-center items-center">
            {/* Using grid columns for guaranteed equal spacing and width */}
            <div className="grid grid-cols-3 gap-0 w-[400px]">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex justify-center items-center relative group"
                  >
                    <span className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? "text-[#95bdc9]" : "text-[#888888] group-hover:text-white"
                    }`}>
                      {link.name}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-[-16px] w-[50%] h-[2px] bg-[#95bdc9] shadow-[0_0_8px_rgba(150,230,160,0.5)] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#888888] hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-[#505050]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-center w-full ${
                    isActive
                      ? "text-[#95bdc9] bg-[#111111]"
                      : "text-[#888888] hover:text-white hover:bg-[#111111]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
