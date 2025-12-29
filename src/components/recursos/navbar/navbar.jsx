"use client";
import React, { useState } from 'react';
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

  // COLORES DE TU CAPTURA
  const colors = {
    fondoLavanda: "#E2D8E6", // El fondo claro de la imagen
    lavandaOscuro: "#6B5E70", // El color del botón sólido
    bordeSutil: "rgba(107, 94, 112, 0.2)"
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/"; 
  };

  const puedeSubir = perfil?.rol === 'admin' || perfil?.rol === 'autor';
  
  const closeAll = () => {
    setOpenSubmenu(null);
    setUserMenuOpen(false);
  };

  const isGroupActive = (paths) => paths.some(path => currentPath === path);

  return (
    <>
      {/* --- PC: NAVBAR --- */}
      <header className="hidden md:block sticky top-0 w-full z-[1000] bg-[#E2D8E6]/80 backdrop-blur-md border-b border-[#6B5E70]/10">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">
          
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-[#6B5E70] hover:scale-105 transition-transform flex items-center gap-2">
            <Flower2 size={24} />
            <span>FRANI<span className="opacity-50">LOVER</span></span>
          </Link>

          <nav className="flex items-center gap-1 bg-[#6B5E70]/5 p-1 rounded-2xl border border-[#6B5E70]/10">
            <Link href="/sobre-mi" className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              currentPath === '/sobre-mi' 
                ? "bg-white text-[#6B5E70] shadow-md" 
                : "text-[#6B5E70]/50 hover:text-[#6B5E70] hover:bg-white/40"
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
              colors={colors}
            />

            <PCGroup 
              label="GOS" 
              active={isGroupActive(['/personajes', '/archivos'])}
              items={[
                { href: '/personajes', label: 'Personajes', icon: <Users size={14}/> },
                { href: '/archivos', label: 'Archivos', icon: <Terminal size={14}/> }
              ]} 
              currentPath={currentPath}
              colors={colors}
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

      {/* --- MÓVIL: NAVBAR INFERIOR --- */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[1000]">
        <div className="bg-[#E2D8E6]/95 backdrop-blur-xl border border-[#6B5E70]/20 h-16 rounded-full flex items-center justify-around px-2 shadow-lg relative">
          
          <Link href="/sobre-mi" onClick={closeAll} className="flex-1 flex justify-center">
            <Smile size={22} className={currentPath === "/sobre-mi" ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
          </Link>

          <button onClick={() => setOpenSubmenu(openSubmenu === 'personal' ? null : 'personal')} className="flex-1 flex justify-center">
            <Camera size={22} className={isGroupActive(['/dibujos', '/fotos']) || openSubmenu === 'personal' ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
          </button>

          <div className="flex-1 flex justify-center">
            {puedeSubir ? (
              <Link href="/upload" onClick={closeAll} className={cn(
                "p-4 rounded-full -translate-y-8 shadow-lg transition-all active:scale-90",
                currentPath === '/upload' ? "bg-white text-[#6B5E70]" : "bg-[#6B5E70] text-white"
              )}>
                <Plus size={24} strokeWidth={3} />
              </Link>
            ) : (
              <div className="flex items-center justify-center -translate-y-1">
                <Flower2 className="w-8 h-8 text-[#6B5E70]/30" />
              </div>
            )}
          </div>

          <button onClick={() => setOpenSubmenu(openSubmenu === 'gos' ? null : 'gos')} className="flex-1 flex justify-center">
            <Sparkles size={22} className={isGroupActive(['/personajes', '/archivos']) || openSubmenu === 'gos' ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
          </button>

          <button onClick={() => user ? setUserMenuOpen(!userMenuOpen) : window.location.href="/login"} className="flex-1 flex justify-center">
            <User size={22} className={user || userMenuOpen ? "text-[#6B5E70]" : "text-[#6B5E70]/30"} />
          </button>

          {/* SUBMENÚS MÓVIL */}
          <AnimatePresence>
            {(openSubmenu || (userMenuOpen && user)) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-24 left-0 right-0 bg-white border border-[#6B5E70]/10 rounded-[2.5rem] p-3 shadow-2xl flex flex-col gap-2">
                
                {openSubmenu === 'personal' && (
                  <div className="grid grid-cols-2 gap-2">
                    <MobileSubItem href="/dibujos" label="Dibujos" active={currentPath === '/dibujos'} icon={<ImageIcon size={18}/>} onClick={closeAll} colors={colors} />
                    <MobileSubItem href="/fotos" label="Fotos" active={currentPath === '/fotos'} icon={<Camera size={18}/>} onClick={closeAll} colors={colors} />
                  </div>
                )}

                {openSubmenu === 'gos' && (
                  <div className="grid grid-cols-2 gap-2">
                    <MobileSubItem href="/personajes" label="Personajes" active={currentPath === '/personajes'} icon={<Users size={18}/>} onClick={closeAll} colors={colors} />
                    <MobileSubItem href="/archivos" label="Archivos" active={currentPath === '/archivos'} icon={<Terminal size={18}/>} onClick={closeAll} colors={colors} />
                  </div>
                )}

                {userMenuOpen && user && (
                  <div className="flex flex-col gap-2">
                    <div className="p-5 border-b border-[#6B5E70]/5 flex justify-between items-center px-6">
                      <span className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest">{perfil?.nombre}</span>
                      <span className="text-[9px] font-black text-white bg-[#6B5E70] px-2 py-0.5 rounded-md uppercase">{perfil?.rol}</span>
                    </div>
                    <button onClick={handleLogout} className="w-full p-5 bg-red-50 text-red-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                      Cerrar Sesión <LogOut size={16}/>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {(openSubmenu || userMenuOpen) && <div className="fixed inset-0 z-[999] bg-[#6B5E70]/20 backdrop-blur-sm" onClick={closeAll} />}
    </>
  );
};

// --- SUBCOMPONENTES ---

const PCGroup = ({ label, items, active, currentPath, colors }) => (
  <div className="relative group">
    <button className={cn(
      "px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all rounded-xl",
      active ? "text-[#6B5E70]" : "text-[#6B5E70]/40 group-hover:text-[#6B5E70]"
    )}>
      {label} <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
    </button>
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all">
      <div className="bg-white border border-[#6B5E70]/10 p-2 rounded-2xl shadow-xl min-w-[180px]">
        {items.map((item, i) => (
          <Link key={i} href={item.href} className={cn(
            "flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
            currentPath === item.href 
              ? "bg-[#6B5E70] text-white shadow-sm" 
              : "text-[#6B5E70]/40 hover:text-[#6B5E70] hover:bg-[#6B5E70]/5"
          )}>
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const MobileSubItem = ({ href, label, icon, active, onClick, colors }) => (
  <Link href={href} onClick={onClick} className={cn(
    "flex flex-col items-center gap-3 p-6 rounded-[1.8rem] border transition-all active:scale-95",
    active 
      ? "bg-[#6B5E70] border-[#6B5E70] text-white shadow-lg" 
      : "bg-[#6B5E70]/5 border-[#6B5E70]/5 text-[#6B5E70]/40"
  )}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </Link>
);

export default Navbar;