"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; 
import { useAuth } from '@/components/recursos/control/authContext'; 
import { supabase } from '@/lib/supabase';
import { 
  User, LogOut, Smile, 
  MapPin, Calendar, CircleUser, Landmark // Cambiado: Landmark en lugar de Flower2
} from 'lucide-react';

const Navbar = () => {
  const currentPath = usePathname();
  const { user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setUserMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/"; 
  };

  const closeAll = () => setUserMenuOpen(false);

  const navLinks = [
    { href: '/sobre-mi', label: '¿Que somos?', icon: <Smile size={20}/> },
    { href: '/lugares', label: 'Lugares', icon: <MapPin size={20}/> },
    { href: '/eventos', label: 'Eventos', icon: <Calendar size={20}/> },
  ];

  return (
    <>
      {/* --- PC NAVBAR --- */}
      <header className="hidden md:block sticky top-0 w-full z-[1000] bg-[#E2D8E6]/80 backdrop-blur-md border-b border-[#6B5E70]/10">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">
          
          {/* Logo actualizado con Landmark */}
          <Link href="/" className="text-xl font-black italic tracking-tighter text-[#6B5E70] flex items-center gap-2">
            <Landmark size={22} strokeWidth={2.5} /> 
            <span>Barrio<span className="opacity-40">Cultural</span></span>
          </Link>

          <nav className="flex items-center gap-2 bg-[#6B5E70]/5 p-1 rounded-2xl border border-[#6B5E70]/10">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all rounded-xl",
                  currentPath === link.href ? "bg-[#6B5E70] text-white" : "text-[#6B5E70]/40 hover:text-[#6B5E70]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2">
                  <CircleUser className={cn("transition-colors", userMenuOpen ? "text-[#6B5E70]" : "text-[#6B5E70]/40")} size={28} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-3 w-48 bg-white border border-[#6B5E70]/10 rounded-2xl shadow-xl p-2 z-[1001]"
                    >
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase text-red-400 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={14} /> Salir
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-[10px] font-black uppercase text-[#6B5E70] bg-white px-4 py-2 rounded-full border border-[#6B5E70]/10 shadow-sm hover:bg-[#6B5E70] hover:text-white transition-all">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- MÓVIL --- */}
      <motion.div 
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-48px)] z-[1000]"
        initial={false}
        animate={{ y: isVisible ? 0 : 120, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="bg-[#E2D8E6]/95 backdrop-blur-xl border border-[#6B5E70]/20 shadow-2xl h-[65px] rounded-[35px] flex items-center justify-around px-2 w-full text-[#6B5E70]">
          
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "flex flex-col items-center justify-center transition-all",
                currentPath === link.href ? "opacity-100 scale-110" : "opacity-30"
              )}
            >
              {link.icon}
              <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">{link.label}</span>
            </Link>
          ))}

          <button 
            onClick={() => user ? setUserMenuOpen(!userMenuOpen) : window.location.href="/login"}
            className={cn("transition-all", userMenuOpen || user ? "opacity-100" : "opacity-30")}
          >
            <User size={20} />
            <span className="text-[7px] font-black uppercase mt-1 tracking-tighter block text-center">Perfil</span>
          </button>
        </nav>

        <AnimatePresence>
          {userMenuOpen && user && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-24 left-0 w-full bg-white border border-[#6B5E70]/10 rounded-[2rem] p-3 shadow-2xl z-[1001]">
              <button onClick={handleLogout} className="w-full p-4 bg-red-50 text-red-600 rounded-[1.5rem] font-black uppercase text-[10px] flex items-center justify-center gap-3">
                Cerrar Sesión <LogOut size={16}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {userMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-[#6B5E70]/10 backdrop-blur-sm" onClick={closeAll} />
      )}
    </>
  );
};

export default Navbar;