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
  const { user, perfil } = useAuth(); 

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const linkStyles = (path) => cn(
    "transition-all duration-300 font-bold cursor-pointer",
    currentPath === path ? "text-accent" : "text-white hover:text-accent"
  );

  const puedeSubir = perfil?.rol === 'admin' || perfil?.rol === 'autor';

  return (
    <header className="sticky top-0 z-[1000] bg-bg-menu/80 backdrop-blur-md w-full border-b border-white/5">
      <nav className="mx-auto max-w-container flex items-center justify-between p-4 md:p-5">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-white tracking-tight z-[1001]">
          Franilover
        </Link>

        {/* BOTÓN HAMBURGUESA (Mejorado) */}
        <button 
          className="flex md:hidden flex-col gap-1.5 cursor-pointer z-[1001] p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn("w-6 h-0.5 bg-white transition-all duration-300", isOpen && "rotate-45 translate-y-2")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all duration-300", isOpen && "opacity-0")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all duration-300", isOpen && "-rotate-45 -translate-y-2")}></span>
        </button>

        {/* MENÚ DE NAVEGACIÓN */}
        <ul className={cn(
          "md:flex items-center gap-8 list-none",
          // Estilos para móvil cuando está abierto
          isOpen 
            ? "fixed inset-0 bg-black/95 flex flex-col justify-center items-center gap-6 text-xl z-[1000] animate-in fade-in zoom-in-95 duration-300" 
            : "hidden md:flex"
        )}>
          
          <li>
            <Link href="/" onClick={closeMenu} className={linkStyles('/')}>Inicio</Link>
          </li>
          
          {/* Menú Personal */}
          <li className="flex flex-col items-center md:block group relative">
            <span className="text-white/50 md:text-white text-xs md:text-base uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0">Personal</span>
            <div className="flex flex-row md:flex-col gap-4 md:gap-0 md:absolute md:hidden md:group-hover:block md:bg-bg-menu md:top-full md:left-0 md:min-w-[150px] md:rounded-b-lg md:pt-2">
              <Link href="/dibujos" onClick={closeMenu} className={cn(linkStyles('/dibujos'), "text-sm")}>Dibujos</Link>
              <Link href="/fotos" onClick={closeMenu} className={cn(linkStyles('/fotos'), "text-sm")}>Fotos</Link>
            </div>
          </li>

          {/* Menú Garden */}
          <li className="flex flex-col items-center md:block group relative">
            <span className="text-white/50 md:text-white text-xs md:text-base uppercase md:normal-case tracking-widest md:tracking-normal mb-2 md:mb-0">Garden</span>
            <div className="flex flex-row md:flex-col gap-4 md:gap-0 md:absolute md:hidden md:group-hover:block md:bg-bg-menu md:top-full md:left-0 md:min-w-[150px] md:rounded-b-lg md:pt-2">
              <Link href="/personajes" onClick={closeMenu} className={cn(linkStyles('/personajes'), "text-sm")}>Personajes</Link>
              <Link href="/archivos" onClick={closeMenu} className="text-terminal-green text-sm font-bold">Archivos</Link>
            </div>
          </li>

          {/* 🟢 SECCIÓN DE CUENTA */}
          <li className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-0 pt-8 md:pt-0 border-t border-white/10 md:border-none w-full md:w-auto">
            
            {puedeSubir && (
              <Link href="/upload" onClick={closeMenu} className="text-accent border border-accent/30 px-4 py-1 rounded-full text-xs font-bold uppercase hover:bg-accent hover:text-black transition-all">
                + Subir
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-center md:text-right">
                  {/* AQUÍ USAMOS EL USERNAME DEL PERFIL */}
                  <p className="text-white font-bold text-sm leading-none">
                    {perfil?.username || user.email.split('@')[0]}
                  </p>
                  <p className="text-accent text-[9px] uppercase tracking-widest mt-1">
                    {perfil?.rol}
                  </p>
                </div>
                <button onClick={handleLogout} className="text-white/20 hover:text-white transition-colors">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="px-8 py-3 md:px-5 md:py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all"
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