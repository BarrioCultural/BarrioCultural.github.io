"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils"; 
import { useAuth } from '@/components/authContext'; // Ruta actualizada
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

  // Verificamos si tiene permisos para subir contenido
  const puedeSubir = perfil?.rol === 'admin' || perfil?.rol === 'autor';

  return (
    <header className="sticky top-0 z-[1000] bg-bg-menu w-full">
      <nav className="mx-auto max-w-container flex items-center justify-between p-4 md:p-5">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          Franilover
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button 
          className="flex md:hidden flex-col gap-1.5 cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "rotate-45 translate-y-2")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "opacity-0")}></span>
          <span className={cn("w-6 h-0.5 bg-white transition-all", isOpen && "-rotate-45 -translate-y-2")}></span>
        </button>

        {/* MENÚ DE NAVEGACIÓN */}
        <ul className={cn(
          "md:flex items-center gap-6 list-none",
          isOpen 
            ? "fixed inset-0 bg-bg-menu flex flex-col justify-center items-center gap-8 text-2xl z-40" 
            : "hidden"
        )}>
          
          <li>
            <Link href="/" onClick={closeMenu} className={linkStyles('/')}>Inicio</Link>
          </li>
          
          {/* Menú Personal */}
          <li className="group relative">
            <span className="text-white hover:text-accent cursor-default flex items-center gap-1 font-bold">
              Personal <span className="text-[10px] hidden md:inline">▼</span>
            </span>
            <ul className="md:absolute md:hidden group-hover:block bg-white/5 md:bg-bg-menu p-2 rounded-lg md:shadow-2xl">
              <li><Link href="/dibujos" onClick={closeMenu} className="block p-3 text-sm text-white hover:text-accent">Dibujos</Link></li>
              <li><Link href="/fotos" onClick={closeMenu} className="block p-3 text-sm text-white hover:text-accent">Fotos</Link></li>
            </ul>
          </li>

          {/* Menú Garden */}
          <li className="group relative">
            <span className="text-white hover:text-accent cursor-default flex items-center gap-1 font-bold">
              Garden <span className="text-[10px] hidden md:inline">▼</span>
            </span>
            <ul className="md:absolute md:hidden group-hover:block bg-white/5 md:bg-bg-menu p-2 rounded-lg md:shadow-2xl">
              <li><Link href="/personajes" onClick={closeMenu} className="block p-3 text-sm text-white hover:text-accent">Personajes</Link></li>
              <li><Link href="/archivos" onClick={closeMenu} className="block p-3 text-sm text-terminal-green hover:brightness-125">Archivos</Link></li>
            </ul>
          </li>

          {/* 🟢 SECCIÓN DE CUENTA / ADMIN */}
          <li className="flex flex-col md:flex-row items-center gap-4 border-t border-white/10 md:border-none pt-6 md:pt-0">
            
            {/* Si puede subir, mostramos el botón especial */}
            {puedeSubir && (
              <Link 
                href="/upload" 
                onClick={closeMenu}
                className="bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-md text-xs font-bold uppercase hover:bg-accent hover:text-black transition-all"
              >
                + Subir
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-accent font-black uppercase tracking-tighter leading-none">
                    {perfil?.rol}
                  </span>
                  <span className="text-[10px] text-white/40 truncate max-w-[80px]">
                    {user.email.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  title="Cerrar sesión"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors"
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