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
    <header className="sticky top-0 z-[1000] bg-bg-menu w-full">
      <nav className="mx-auto max-w-container flex items-center justify-between p-4 md:p-5">
        
        {/* LOGO ACTUALIZADO */}
        <div className="text-xl font-bold text-white tracking-tighter uppercase">
          Barrio <span className="text-accent">Cultural</span>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button 
          className="flex md:hidden flex-col gap-1.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "rotate-45 translate-y-2")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "opacity-0")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "-rotate-45 -translate-y-2")}></span>
        </button>

        {/* MENÚ DE NAVEGACIÓN ACTUALIZADO */}
        <ul className={cn(
          "md:flex items-center gap-6 list-none",
          isOpen ? "absolute top-full left-0 w-full bg-bg-menu p-3 flex flex-col animate-in fade-in slide-in-from-top-2" : "hidden md:flex"
        )}>
          
          <li>
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={cn(linkStyles('/'), "block text-center text-lg")}
            >
              Inicio
            </Link>
          </li>
          
          {/* SECCIÓN ORGANIZACIÓN */}
          <li className="group relative">
            <span className="block text-center md:text-left text-lg font-bold text-white cursor-default">
              Explorar <span className="hidden md:inline">▾</span>
            </span>
            
            <ul className="md:hidden group-hover:md:block md:absolute md:top-full md:left-0 md:min-w-[180px] md:bg-bg-menu md:rounded-b-lg md:py-2 md:shadow-xl">
              <li>
                <Link href="/artistas" onClick={closeMenu} className={cn(linkStyles('/artistas'), "block p-3 md:px-5 md:py-3 text-sm")}>
                  Artistas
                </Link>
              </li>
              <li>
                <Link href="/lugares" onClick={closeMenu} className={cn(linkStyles('/lugares'), "block p-3 md:px-5 md:py-3 text-sm")}>
                  Lugares
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link href="/contacto" onClick={closeMenu} className={cn(linkStyles('/contacto'), "block text-center text-lg")}>
              Contacto
            </Link>
          </li>

          <li>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center text-lg text-white hover:text-accent font-bold"
            >
              Proyectos
            </a>
          </li> 
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;