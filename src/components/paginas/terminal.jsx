"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Fingerprint, Zap, X, Terminal, Monitor, Database, AlertCircle } from 'lucide-center';

// --- EFECTO MATRIX RAIN (SE MANTIENE IGUAL) ---
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
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
};

const TerminalLore = () => {
  const [personajes, setPersonajes] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLore = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('personajes_terminal')
        .select('*')
        .order('id', { ascending: true }); // Ordenados por ID según tu captura
      
      if (data) setPersonajes(data);
      if (error) console.error("Error:", error);
      setLoading(false);
    };
    fetchLore();
  }, []);

  // Generador de nombre de archivo dinámico
  const formatFileName = (clase) => {
    return `${clase.toUpperCase().replace(/\s+/g, '_')}.log`;
  };

  return (
    <div className="min-h-screen bg-black w-full relative flex items-center justify-center p-4 md:p-10 overflow-hidden text-[#00ff41] font-mono">
      <MatrixRain />

      <div className="bg-black/90 border-2 border-[#00ff41] p-6 w-full max-w-5xl z-10 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
        <header className="mb-8 border-b border-[#00ff41]/40 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-[10px] tracking-[0.4em] opacity-60 flex items-center gap-2">
              <Monitor size={12} /> PROGRESO_CORE_OS_V2.6
            </h2>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase">
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
                onClick={() => setCurrentFile(p)}
                className="group border border-[#00ff41]/20 p-5 cursor-pointer hover:bg-[#00ff41]/10 hover:border-[#00ff41]/80 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">
                    {p.status}
                  </span>
                  <Fingerprint size={14} className="opacity-20 group-hover:opacity-100" />
                </div>
                
                <h3 className="font-bold text-sm tracking-tight mb-4 relative z-10">
                  {'>'} {formatFileName(p.clase)}
                </h3>

                <div className="flex flex-col border-t border-[#00ff41]/10 pt-3 relative z-10">
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-white group-hover:text-[#00ff41] transition-colors">
                      {p.clase}
                    </span>
                    <span className="text-[9px] opacity-40 uppercase mt-1 leading-tight">
                      {p.descripcion}
                    </span>
                </div>
                {/* Indicador de color dinámico basado en tu columna color_hex */}
                <div 
                  className="absolute top-0 right-0 w-1 h-full opacity-50" 
                  style={{ backgroundColor: p.color_hex }}
                />
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 pt-4 border-t border-[#00ff41]/20 flex justify-between items-center text-[9px] opacity-40 tracking-[0.2em]">
          <span className="animate-pulse">● SYSTEM_ONLINE</span>
          <div className="flex items-center gap-2">
             <Terminal size={12} />
             <span>QUERY_COMPLETED: {personajes.length} RECORDS</span>
          </div>
        </footer>

        {/* MODAL DE DECRIPTACIÓN CON COLUMNAS REALES */}
        {currentFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-black border-2 border-[#00ff41] p-6 md:p-8 max-w-3xl w-full relative shadow-[0_0_100px_rgba(0,255,65,0.4)] overflow-hidden">
              
              <div className="flex justify-between items-center mb-6 border-b border-[#00ff41]/40 pb-4">
                 <div className="flex flex-col">
                   <span className="text-[9px] tracking-[0.5em] opacity-40 uppercase">Dossier_Decryption_Result</span>
                   <span className="text-md font-bold text-[#00ff41] mt-1 uppercase">FILE: {formatFileName(currentFile.clase)}</span>
                 </div>
                 <button onClick={() => setCurrentFile(null)} className="text-[#00ff41] hover:bg-[#00ff41] hover:text-black p-1 border border-[#00ff41]/40 transition-all">
                   <X size={24} />
                 </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagen del personaje - Columna imagen_url */}
                {currentFile.imagen_url && (
                  <div className="w-full md:w-48 h-48 border border-[#00ff41]/40 grayscale contrast-125 brightness-75 relative shrink-0">
                    <img src={currentFile.imagen_url} className="w-full h-full object-cover mix-blend-screen opacity-80" alt="Identity scan" />
                    <div className="absolute inset-0 border-2 border-[#00ff41]/20 pointer-events-none"></div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 border border-[#00ff41] text-[10px] font-bold" style={{ color: currentFile.color_hex }}>
                      {currentFile.status}
                    </span>
                    <span className="text-[10px] opacity-50">CLASE: {currentFile.clase}</span>
                  </div>
                  
                  {/* Contenido principal - Columna contenido */}
                  <div className="text-sm md:text-base leading-relaxed mb-6 min-h-[100px] text-green-100">
                    <TypewriterText text={currentFile.contenido || "NO_DATA_AVAILABLE"} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold opacity-30 uppercase border-t border-[#00ff41]/30 pt-4">
                 <span className="flex items-center gap-2"> <Zap size={10} /> CLEARANCE_GRANTED</span>
                 <span className="italic font-mono">END_OF_FILE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalLore;