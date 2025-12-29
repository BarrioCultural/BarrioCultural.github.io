"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; 
import { useAuth } from '@/components/recursos/authContext'; 
import { supabase } from '@/lib/supabase';
import { 
  User, 
  LogOut, 
  Plus, 
  ChevronDown, 
  Smile, 
  Image as ImageIcon, 
  Camera, 
  Sparkles, 
  Users, 
  Terminal, 
  CircleUser,
  Flower2 
} from 'lucide-react';

const Navbar = () => {
  const currentPath = usePathname();
  const { user, perfil } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // --- LÓGICA DE SCROLL (MÓVIL) ---
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Colapsar si baja más de 60px y está bajando
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        setIsCollapsed(true);
        setOpenSubmenu(null);
        setUserMenuOpen(false);
      } else {
        setIsCollapsed(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/"; 
  };

  // Permisos según tus instrucciones guardadas [cite: 2025-12-28]
  const puedeSubir = perfil?.rol === 'admin' || perfil?.rol === 'autor';
  
  const closeAll = () => {
    setOpenSubmenu(null);
    setUserMenuOpen(false);
  };

  const isGroupActive = (paths) => paths.some(path => currentPath === path);

  return (
    <>
      {/* --- PC: NAVBAR (Fondo Lavanda Claro) --- */}
      <header className="hidden md:block sticky top-0 w-full z-[1000] bg-[#E2D8E6]/80 backdrop-blur-md border-b border-[#6B5E70]/10">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">
          
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-[#6B5E70] hover:scale-105 transition-transform flex items-center gap-2">
            <Flower2 size={24} />
            <span>FRANI<span className="opacity-40">LOVER</span></span>
          </Link>

          <nav className="flex items-center gap-1 bg-[#6B5E70]/5 p-1 rounded-2xl border border-[#6B5E70]/10">
            <Link href="/sobre-mi" className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              currentPath === '/sobre-mi' ? "bg-white text-[#6B5E70] shadow-md" : "text-[#6B5E70]/40 hover:text-[#6B5E70] hover:bg-white/40"
            )}>
              Bio
            </Link>

            <PCGroup 
              label="Personal" 
              active={isGroupActive(['/dibujos', '/fotos'])}
              items={[
                { href: '/dibujos', label: 'Dibujos', icon: <ImageIcon size={14}/> },
                { href: '/fotos', label: 'Fotos', icon: <Camera size={14}/> }
              ]} 
              currentPath={currentPath}
            />

            <PCGroup 
              label="GOS" 
              active={isGroupActive(['/personajes', '/archivos'])}
              items={[
                { href: '/personajes', label: 'Personajes', icon: <Users size={14}/> },
                { href: '/archivos', label: 'Archivos', icon: <Terminal size={14}/> }
              ]} 
              currentPath={currentPath}
            />
          </nav>

          <div className="flex items-center gap-6">
            {puedeSubir && (
              <Link href="/upload" className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-[#6B5E70]/10",
                currentPath === '/upload' ? "bg-white text-[#6B5E70]" : "bg-[#6B5E70] text-white hover:opacity-90"
              )}>
                + SUBIR
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 pl-6 border-l border-[#6B5E70]/20 group">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-[#6B5E70] leading-none">{perfil?.nombre || 'User'}</span>
                    <span className="text-[8px] font-bold text-[#6B5E70]/40 uppercase tracking-widest mt-1">{perfil?.rol}</span>
                  </div>
                  <CircleUser className={cn("transition-colors", userMenuOpen ? "text-[#6B5E70]" : "text-[#6B5E70]/40 group-hover:text-[#6B5E70]")} size={28} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-3 bg-white border border-[#6B5E70]/10 p-2 rounded-2xl shadow-xl min-w-[200px] z-50">
                      <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        Cerrar Sesión <LogOut size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-[10px] font-black uppercase text-[#6B5E70]/60 hover:text-[#6B5E70] transition-all">Entrar</Link>
            )}
          </div>
        </div>
      </header>

      {/* --- MÓVIL: NAVBAR FLOTANTE / CÍRCULO --- */}
      <div className="md:hidden fixed bottom-6 right-6 left-auto z-[1000] flex flex-col items-end">
        <motion.nav 
          animate={{ 
            width: isCollapsed ? "60px" : "calc(100vw - 48px)",
            height: "60px",
            borderRadius: "30px",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="bg-[#E2D8E6]/95 backdrop-blur-xl border border-[#6B5E70]/20 shadow-2xl overflow-hidden flex items-center justify-center relative"
        >
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.button 
                key="col" 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                exit={{ scale: 0 }} 
                onClick={() => setIsCollapsed(false)} 
                className="text-[#6B5E70]"
              >
                <Flower2 size={26} />
              </motion.button>
            ) : (
              <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full items-center justify-around px-2">
                <Link href="/sobre-mi" onClick={closeAll} className="flex-1 flex justify-center">
                  <Smile size={22} className={currentPath === "/sobre-mi" ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
                </Link>
                <button onClick={() => setOpenSubmenu(openSubmenu === 'personal' ? null : 'personal')} className="flex-1 flex justify-center">
                  <Camera size={22} className={isGroupActive(['/dibujos', '/fotos']) || openSubmenu === 'personal' ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
                </button>
                <div className="flex-1 flex justify-center">
                  <Link href={puedeSubir ? "/upload" : "/"} onClick={closeAll} className={cn(
                    "p-3 rounded-full shadow-lg transition-all",
                    currentPath === '/upload' ? "bg-white text-[#6B5E70]" : "bg-[#6B5E70] text-white"
                  )}>
                    {puedeSubir ? <Plus size={20} strokeWidth={3} /> : <Flower2 size={20} />}
                  </Link>
                </div>
                <button onClick={() => setOpenSubmenu(openSubmenu === 'gos' ? null : 'gos')} className="flex-1 flex justify-center">
                  <Sparkles size={22} className={isGroupActive(['/personajes', '/archivos']) || openSubmenu === 'gos' ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
                </button>
                <button onClick={() => user ? setUserMenuOpen(!userMenuOpen) : window.location.href="/login"} className="flex-1 flex justify-center">
                  <User size={22} className={user || userMenuOpen ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* SUBMENÚS MÓVIL */}
        <AnimatePresence>
          {!isCollapsed && (openSubmenu || (userMenuOpen && user)) && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 15 }} 
              className="absolute bottom-20 right-0 w-[calc(100vw-48px)] bg-white border border-[#6B5E70]/10 rounded-[2rem] p-3 shadow-2xl flex flex-col gap-2 z-[1001]"
            >
              {openSubmenu === 'personal' && (
                <div className="grid grid-cols-2 gap-2">
                  <MobileSubItem href="/dibujos" label="Dibujos" active={currentPath === '/dibujos'} icon={<ImageIcon size={18}/>} onClick={closeAll} />
                  <MobileSubItem href="/fotos" label="Fotos" active={currentPath === '/fotos'} icon={<Camera size={18}/>} onClick={closeAll} />
                </div>
              )}
              {openSubmenu === 'gos' && (
                <div className="grid grid-cols-2 gap-2">
                  <MobileSubItem href="/personajes" label="Personajes" active={currentPath === '/personajes'} icon={<Users size={18}/>} onClick={closeAll} />
                  <MobileSubItem href="/archivos" label="Archivos" active={currentPath === '/archivos'} icon={<Terminal size={18}/>} onClick={closeAll} />
                </div>
              )}
              {userMenuOpen && user && (
                <div className="flex flex-col gap-2">
                  <div className="p-4 border-b border-[#6B5E70]/5 flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest">{perfil?.nombre}</span>
                    <span className="text-[9px] font-black text-white bg-[#6B5E70] px-2 py-0.5 rounded-md uppercase">{perfil?.rol}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full p-4 bg-red-50 text-red-600 rounded-[1.5rem] font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-colors active:bg-red-100">
                    Cerrar Sesión <LogOut size={16}/>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OVERLAY GLOBAL */}
      {(openSubmenu || userMenuOpen) && !isCollapsed && (
        <div className="fixed inset-0 z-[999] bg-[#6B5E70]/20 backdrop-blur-sm" onClick={closeAll} />
      )}
    </>
  );
};

// --- SUBCOMPONENTE PC GROUP ---
const PCGroup = ({ label, items, active, currentPath }) => (
  <div className="relative group">
    <button className={cn(
      "px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all rounded-xl",
      active ? "text-[#6B5E70]" : "text-[#6B5E70]/30 group-hover:text-[#6B5E70]"
    )}>
      {label} <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300" />
    </button>
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200">
      <div className="bg-white border border-[#6B5E70]/10 p-2 rounded-2xl shadow-xl min-w-[180px]">
        {items.map((item, i) => (
          <Link 
            key={i} 
            href={item.href} 
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
              currentPath === item.href 
                ? "bg-[#6B5E70] text-white shadow-sm" 
                : "text-[#6B5E70]/40 hover:text-[#6B5E70] hover:bg-[#6B5E70]/5"
            )}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

// --- SUBCOMPONENTE MÓVIL ITEM ---
const MobileSubItem = ({ href, label, icon, active, onClick }) => (
  <Link 
    href={href} 
    onClick={onClick} 
    className={cn(
      "flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border transition-all active:scale-95",
      active 
        ? "bg-[#6B5E70] border-[#6B5E70] text-white shadow-lg" 
        : "bg-[#6B5E70]/5 border-[#6B5E70]/5 text-[#6B5E70]/40"
    )}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </Link>
);

export default Navbar;