"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Fingerprint, Zap, X, Terminal, Monitor, Database } from 'lucide-react';

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
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
};

const TerminalLore = () => {
  const [currentFile, setCurrentFile] = useState(null);

  const ARCHIVOS = [
    { id: 1, nombre: "PINK_KILLER.log", personaje: "Pink Killer", desc: "Registro de la asesina principal", color: '#FFB7CE', status: "CRITICAL" },
    { id: 2, nombre: "ACCESO_DORIAN.key", personaje: "Dorian", desc: "Notas del líder del PF", color: '#D4B2F2', status: "AUTHORIZED" },
    { id: 3, nombre: "DATABASE_FAKER.dat", personaje: "Faker", desc: "Registros de hackeo", color: '#FDFD96', status: "LOCKED" },
    { id: 4, nombre: "ANALISIS_FRANI.txt", personaje: "Frani", desc: "Informe de vigilancia", color: '#FFF9C4', status: "WATCHING" },
    { id: 5, nombre: "REGISTRO_ABEL.sec", personaje: "Abel", desc: "Análisis de linaje", color: '#B2E2F2', status: "RESTRICTED" },
    { id: 6, nombre: "EXP_QUIMERA.cfg", personaje: "Quimera", desc: "Resultados de mutación", color: '#B2F2B2', status: "DANGER" }
  ];

  const obtenerContenido = (p) => {
    const data = {
      "Pink Killer": "ERROR 404: Datos corruptos. El rastro de la asesina ha sido borrado por un protocolo externo. Velocidad extrema detectada.",
      "Dorian": "Último registro: Dorian ha tomado el control del tráfico en la zona norte. Priorizar recuperación de la droga del abismo.",
      "Faker": "ACCESO DENEGADO. Intento de rastreo detectado. Sujeto capaz de vulnerar cualquier firewall del sistema central.",
      "Frani": "Sujeto: Frani. Observación: Podría sernos útil... Posee una capacidad de observación post-mortem inusual.",
      "Abel": "REGISTRO REAL: El heredero ha desertado. Se desplaza por los suburbios. Su sangre es vital para el Proyecto.",
      "Quimera": "PROYECTO QUIMERA: Experimento exitoso. Capacidad de adaptación biológica confirmada. El espécimen escapó durante el apagón."
    };
    return data[p] || "Archivo vacío.";
  };

  return (
    <div className="min-h-screen bg-black w-full relative flex items-center justify-center p-4 md:p-10 overflow-hidden text-[#00ff41] font-mono">
      <MatrixRain />

      <div className="bg-black/90 border-2 border-[#00ff41] p-6 w-full max-w-5xl z-10 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse"></div>

        <header className="mb-8 border-b border-[#00ff41]/40 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-[10px] tracking-[0.4em] opacity-60 flex items-center gap-2 justify-center md:justify-start">
              <Monitor size={12} /> PARTIDO_POR_EL_PROGRESO_V2
            </h2>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]">
              ARCHIVOS_DE_INTELIGENCIA
            </h1>
          </div>
          <div className="text-right">
              <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Account_Mode: OPTIONAL</p>
              <p className="text-[9px] font-bold text-green-300 uppercase tracking-widest">STATUS: ADMIN_AUTHORIZED</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARCHIVOS.map((p) => (
            <div 
              key={p.id}
              onClick={() => setCurrentFile({ nombre: p.nombre, personaje: p.personaje, contenido: obtenerContenido(p.personaje), color: p.color })}
              className="group border border-[#00ff41]/20 p-5 cursor-pointer hover:bg-[#00ff41]/10 hover:border-[#00ff41]/80 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">{p.status}</span>
                <Fingerprint size={14} className="opacity-20 group-hover:opacity-100" />
              </div>
              <h3 className="font-bold text-sm tracking-tight mb-4">{'>'} {p.nombre}</h3>
              <div className="flex flex-col border-t border-[#00ff41]/10 pt-3">
                  <span className="text-[10px] font-black uppercase italic tracking-widest" style={{ color: p.color }}>{p.personaje}</span>
                  <span className="text-[9px] opacity-40 uppercase mt-1 leading-tight">{p.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 pt-4 border-t border-[#00ff41]/20 flex justify-between items-center text-[9px] opacity-40 tracking-[0.2em]">
          <span className="animate-pulse">● RECIBIENDO_DATOS...</span>
          <div className="flex items-center gap-2">
             <Terminal size={12} />
             <span>CONEXIÓN_SEGURA</span>
          </div>
        </footer>

        {currentFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-black border-2 border-[#00ff41] p-8 max-w-2xl w-full relative shadow-[0_0_100px_rgba(0,255,65,0.4)]">
              <div className="flex justify-between items-center mb-6 border-b border-[#00ff41]/40 pb-4">
                 <div className="flex flex-col">
                   <span className="text-[9px] tracking-[0.5em] opacity-40 uppercase">Decription_In_Progress</span>
                   <span className="text-md font-bold text-[#00ff41] mt-1 uppercase">FILE: {currentFile.nombre}</span>
                 </div>
                 <button onClick={() => setCurrentFile(null)} className="text-[#00ff41] hover:bg-[#00ff41] hover:text-black p-1 border border-[#00ff41]/40 transition-all">
                   <X size={24} />
                 </button>
              </div>
              <div className="text-lg md:text-xl leading-relaxed mb-10 min-h-[120px] drop-shadow-[0_0_5px_rgba(0,255,65,0.4)]">
                <TypewriterText text={currentFile.contenido} />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold opacity-30 uppercase border-t border-[#00ff41]/30 pt-4">
                 <span className="flex items-center gap-2"> <Zap size={10} /> ACCESS_GRANTED</span>
                 <span className="italic">END_OF_TRANSMISSION</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalLore;


