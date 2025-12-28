"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils"; 
import { useAuth } from '@/components/authContext'; 
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, perfil, loading } = useAuth(); // Añadimos loading para evitar parpadeos

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Limpiamos todo rastro local
    localStorage.clear();
    sessionStorage.clear();
    // Redirección forzada: Esto limpia el estado de React por completo
    window.location.href = "/"; 
  };

  const linkStyles = (path) => cn(
    "transition-all duration-300 font-bold cursor-pointer",
    currentPath === path ? "text-accent" : "text-white hover:text-accent"
  );

  const puedeSubir = perfil?.rol === 'admin' || perfil?.rol === 'autor';

  return (
    <header className="sticky top-0 z-1000 bg-bg-menu w-full border-b border-white/5">
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
          <span className={cn("w-6 h-0.75 bg-white transition-all", isOpen && "rotate-45 translate-y-2")}></span>
          <span className={cn("w-6 h-0.75 bg-white transition-all", isOpen && "opacity-0")}></span>
          <span className={cn("w-6 h-0.75 bg-white transition-all", isOpen && "-rotate-45 -translate-y-2")}></span>
        </button>

        {/* MENÚ DE NAVEGACIÓN */}
        <ul className={cn(
          "md:flex items-center gap-6 list-none", // Quitamos el hidden por defecto para que el cn lo controle
          isOpen ? "absolute top-full left-0 w-full bg-bg-menu p-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2" : "hidden"
        )}>
          
          {/* INICIO */}
          <li className="w-full md:w-auto bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3">
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={cn(linkStyles('/'), "block text-center text-lg md:p-0 bg-white/10 md:bg-transparent rounded-lg p-3")}
            >
              Inicio
            </Link>
          </li>
          
          {/* PERSONAL */}
          <li className="w-full md:w-auto group relative bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3 md:p-0">
            <span className="block text-center md:text-left text-sm md:text-lg font-bold text-accent md:text-white uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0 cursor-default">
              Personal <span className="hidden md:inline">▾</span>
            </span>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:hidden group-hover:md:block md:absolute md:top-full md:left-0 md:min-w-45 md:bg-bg-menu md:rounded-b-lg md:py-2 md:shadow-xl">
              <li><Link href="/dibujos" onClick={closeMenu} className={cn(linkStyles('/dibujos'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>Dibujos</Link></li>
              <li><Link href="/fotos" onClick={closeMenu} className={cn(linkStyles('/fotos'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>Fotos</Link></li>
              <li className="col-span-2 md:col-span-1"><Link href="/contacto" onClick={closeMenu} className={cn(linkStyles('/contacto'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>Contacto</Link></li>
            </ul>
          </li>

          {/* GARDEN */}
          <li className="w-full md:w-auto group relative bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3 md:p-0">
            <span className="block text-center md:text-left text-sm md:text-lg font-bold text-accent md:text-white uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0 cursor-default">
              Garden of Sins <span className="hidden md:inline">▾</span>
            </span>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:hidden group-hover:md:block md:absolute md:top-full md:left-0 md:min-w-45 md:bg-bg-menu md:rounded-b-lg md:py-2 md:shadow-xl">
              <li><Link href="/personajes" onClick={closeMenu} className={cn(linkStyles('/personajes'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md")}>Personajes</Link></li>
              <li><Link href="/archivos" onClick={closeMenu} className={cn(linkStyles('/archivos'), "block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm rounded-md text-terminal-green")}>Archivos</Link></li>
              <li className="col-span-2 md:col-span-1"><a href="https://youtube.com" target="_blank" className="block text-center md:text-left bg-white/10 md:bg-transparent p-2 md:px-5 md:py-3 text-xs md:text-sm text-white rounded-md">Animaciones</a></li>
            </ul>
          </li> 

          {/* LOGIN / CUENTA - Lógica Corregida */}
          <li className="w-full md:w-auto bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-xl p-3">
            {!loading && user && perfil ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-[10px] text-accent font-bold uppercase leading-none mb-1">{perfil.rol}</span>
                  <span className="text-white font-bold text-sm">{perfil.username || user.email.split('@')[0]}</span>
                </div>
                <div className="flex items-center gap-3">
                  {puedeSubir && (
                    <Link 
                      href="/upload" 
                      onClick={closeMenu} 
                      className="bg-accent text-black text-[10px] font-black px-3 py-1 rounded uppercase hover:bg-white transition-all"
                    >
                      + SUBIR
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest"
                  >
                    Salir
                  </button>
                </div>
              </div>
            ) : !loading && (
              <Link 
                href="/login" 
                onClick={closeMenu} 
                className="block text-center text-lg font-bold text-white hover:text-accent bg-white/10 md:bg-transparent rounded-lg p-3 md:p-0 uppercase"
              >
                Entrar
              </Link>
            )}
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Navbar;