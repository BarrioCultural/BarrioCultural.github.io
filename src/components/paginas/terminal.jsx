"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; // Importación de Supabase
import { ShieldAlert, Fingerprint, Zap, X, Terminal, Monitor, Database, Hash } from 'lucide-react';

// --- EFECTO MATRIX RAIN ---
const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
};

const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15); // Un poco más rápido para descripciones largas
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
};

const TerminalLore = () => {
  const [personajes, setPersonajes] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DE DATOS DESDE SUPABASE ---
  useEffect(() => {
    const fetchLore = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('lore_personajes')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (data) setPersonajes(data);
      if (error) console.error("Error cargando terminal_data:", error);
      setLoading(false);
    };
    fetchLore();
  }, []);

  // Generador de nombre de archivo ficticio basado en el nombre real
  const formatFileName = (nombre) => {
    const extensions = ['.log', '.key', '.dat', '.sec', '.cfg', '.exe'];
    const cleanName = nombre.toUpperCase().replace(/\s+/g, '_');
    const randomExt = extensions[Math.floor(Math.random() * extensions.length)];
    return `${cleanName}${randomExt}`;
  };

  return (
    <div className="min-h-screen bg-black w-full relative flex items-center justify-center p-4 md:p-10 overflow-hidden text-[#00ff41] font-mono">
      <MatrixRain />

      <div className="bg-black/90 border-2 border-[#00ff41] p-6 w-full max-w-5xl z-10 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse"></div>

        <header className="mb-8 border-b border-[#00ff41]/40 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-[10px] tracking-[0.4em] opacity-60 flex items-center gap-2 justify-center md:justify-start">
              <Monitor size={12} /> PROGRESO_CORE_OS_V2.6
            </h2>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]">
              PERSONAJES_TERMINAL
            </h1>
          </div>
          <div className="text-right">
              <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Access_Lvl: ROOT</p>
              <p className="text-[9px] font-bold text-green-300 uppercase tracking-widest">ENCRYPTION: AES-256</p>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
            <Database className="animate-spin" />
            <span className="tracking-[0.5em] text-xs">DECRYPTING_DATABASE...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personajes.map((p) => (
              <div 
                key={p.id}
                onClick={() => setCurrentFile({ 
                  nombre: formatFileName(p.nombre), 
                  personaje: p.nombre, 
                  contenido: p.sobre, 
                  tags: p.tags,
                  img: p.img_url 
                })}
                className="group border border-[#00ff41]/20 p-5 cursor-pointer hover:bg-[#00ff41]/10 hover:border-[#00ff41]/80 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">
                    {p.tags?.[0] || 'UNCLASSIFIED'}
                  </span>
                  <Fingerprint size={14} className="opacity-20 group-hover:opacity-100" />
                </div>
                
                <h3 className="font-bold text-sm tracking-tight mb-4 relative z-10">
                  {'>'} {formatFileName(p.nombre)}
                </h3>

                <div className="flex flex-col border-t border-[#00ff41]/10 pt-3 relative z-10">
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-white group-hover:text-[#00ff41] transition-colors">
                      {p.nombre}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[7px] border border-[#00ff41]/30 px-1 opacity-50">#{tag}</span>
                      ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 pt-4 border-t border-[#00ff41]/20 flex justify-between items-center text-[9px] opacity-40 tracking-[0.2em]">
          <span className="animate-pulse">● SYSTEM_ONLINE</span>
          <div className="flex items-center gap-2">
             <Terminal size={12} />
             <span>QUERY_COMPLETED: {personajes.length} FILES</span>
          </div>
        </footer>

        {/* MODAL DE DECRIPTACIÓN */}
        {currentFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-black border-2 border-[#00ff41] p-6 md:p-8 max-w-3xl w-full relative shadow-[0_0_100px_rgba(0,255,65,0.4)] overflow-hidden">
              
              <div className="flex justify-between items-center mb-6 border-b border-[#00ff41]/40 pb-4">
                 <div className="flex flex-col">
                   <span className="text-[9px] tracking-[0.5em] opacity-40 uppercase">Dossier_Visual_Analysis</span>
                   <span className="text-md font-bold text-[#00ff41] mt-1 uppercase">FILE: {currentFile.nombre}</span>
                 </div>
                 <button onClick={() => setCurrentFile(null)} className="text-[#00ff41] hover:bg-[#00ff41] hover:text-black p-1 border border-[#00ff41]/40 transition-all">
                   <X size={24} />
                 </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagen del personaje con filtro terminal */}
                {currentFile.img && (
                  <div className="w-full md:w-48 h-48 border border-[#00ff41]/40 grayscale contrast-125 brightness-75 relative shrink-0">
                    <img src={currentFile.img} className="w-full h-full object-cover mix-blend-screen opacity-80" alt="Identity scan" />
                    <div className="absolute inset-0 border-2 border-[#00ff41]/20 pointer-events-none"></div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentFile.tags?.map((tag, idx) => (
                      <span key={idx} className="text-[9px] bg-[#00ff41]/10 px-2 py-0.5 border border-[#00ff41]/40 text-[#00ff41]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm md:text-base leading-relaxed mb-6 min-h-[100px] text-green-100">
                    <TypewriterText text={currentFile.contenido || "NO_DATA_AVAILABLE"} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold opacity-30 uppercase border-t border-[#00ff41]/30 pt-4">
                 <span className="flex items-center gap-2"> <Zap size={10} /> CLEARANCE_LEVEL: ROOT</span>
                 <span className="italic font-mono">SECURE_LINK_ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalLore;