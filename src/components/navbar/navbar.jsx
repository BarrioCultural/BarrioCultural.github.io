"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils"; 

const Navbar = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const linkStyles = (path) => cn(
    "transition-all duration-300 font-bold cursor-pointer",
    currentPath === path ? "text-accent" : "text-white hover:text-accent"
  );

  return (
    <header className="sticky top-0 z-1000 bg-bg-menu w-full">
      <nav className="mx-auto max-w-container flex items-center justify-between p-4 md:p-5">
        
        {/* LOGO */}
        <div className="text-xl font-bold text-white tracking-tight">
          Franilover
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button 
          className="flex md:hidden flex-col gap-1.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          <span className="w-6 h-0.75 bg-white transition-all"></span>
          <span className="w-6 h-0.75 bg-white transition-all"></span>
          <span className="w-6 h-0.75 bg-white transition-all"></span>
        </button>

        {/* MENÚ DE NAVEGACIÓN */}
        <ul className={cn(
          "hidden md:flex items-center gap-6 list-none",
          isOpen ? "absolute top-full left-0 w-full bg-bg-menu p-3 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2" : "hidden"
        )}>
          
          <li className="md:contents bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3">
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={cn(linkStyles('/'), "block text-center text-lg md:p-0 bg-white/10 md:bg-transparent rounded-lg p-3")}
            >
              Inicio
            </Link>
          </li>
          
          <li className="group relative bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3 md:p-0">
            <span className="block text-center md:text-left text-sm md:text-lg font-bold text-accent md:text-white uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0 cursor-default">
              Personal <span className="hidden md:inline">▾</span>
            </span>
            
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:hidden group-hover:md:block md:absolute md:top-full md:left-0 md:min-w-45 md:bg-bg-menu md:rounded-b-lg md:py-2 md:shadow-xl">
              <li>
                <Link href="/dibujos" onClick={closeMenu} className={cn(linkStyles('/dibujos'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>
                  Dibujos
                </Link>
              </li>
              <li>
                <Link href="/fotos" onClick={closeMenu} className={cn(linkStyles('/fotos'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>
                  Fotos
                </Link>
              </li>
              <li>
                <Link href="/contacto" onClick={closeMenu} className={cn(linkStyles('/contacto'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>
                  Contacto
                </Link>
              </li>
            </ul>
          </li>

          <li className="group relative bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3 md:p-0">
            <span className="block text-center md:text-left text-sm md:text-lg font-bold text-accent md:text-white uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0 cursor-default">
              Garden of Sins <span className="hidden md:inline">▾</span>
            </span>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:hidden group-hover:md:block md:absolute md:top-full md:left-0 md:min-w-45 md:bg-bg-menu md:rounded-b-lg md:py-2 md:shadow-xl">
              <li>
                <Link href="/personajes" onClick={closeMenu} className={cn(linkStyles('/personajes'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>
                  Personajes
                </Link>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" className="block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm text-white rounded-md">
                  Animaciones
                </a>
              </li>
            </ul>
          </li> 
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;