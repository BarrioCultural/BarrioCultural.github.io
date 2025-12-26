"use client";
import React, { useState, useEffect, useRef } from 'react';
import ArchivoDisplay from '@/components/ArchivoDisplay';

const ARCHIVOS_PROHIBIDOS = [
  { nombre: "PROYECTO_PK.log", tipo: "LOG", contenido: "Sujeto: Pink Killer. Estado: Evolución inestable. Objetivo: Localizar el núcleo de la corporación.", color: 'terminal-green' },
  { nombre: "FAKER_ACCESS.key", tipo: "KEY", contenido: "Acceso total denegado. Se ha detectado un intento de intrusión por el protocolo 404.", color: 'terminal-red' },
  { nombre: "DIARIO_DORIAN.txt", tipo: "TXT", contenido: "Día 45: Las sombras en el Reino Torres están creciendo. No confíes en las luces del norte.", color: 'terminal-green' },
];

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);

  const prefix = 'SYSTEM@NEXUS:> ';

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Mensaje de inicio con efecto de carga
  useEffect(() => {
    const bienvenida = [
      "ESTABLECIENDO PROTOCOLO DE CONEXIÓN...",
      "BYPASSING FIREWALL... [OK]",
      "ACCEDIENDO A ARCHIVOS PROHIBIDOS...",
      "BIENVENIDO AGENTE. ESCRIBE 'LS' PARA LISTAR.",
    ];
    
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bienvenida.length) {
        setOutput(prev => [...prev, bienvenida[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400); // Velocidad inicial de carga
    
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      const cleanCmd = command.trim().toLowerCase();
      const newLines = [`${prefix}${command}`];

      if (cleanCmd === 'ls') {
        newLines.push("LISTANDO DIRECTORIO...");
        ARCHIVOS_PROHIBIDOS.forEach(f => newLines.push(`- ${f.nombre} [${f.tipo}]`));
      } 
      else if (cleanCmd.startsWith('cat ')) {
        const fileName = cleanCmd.replace('cat ', '');
        const file = ARCHIVOS_PROHIBIDOS.find(f => f.nombre.toLowerCase() === fileName);
        if (file) {
          setCurrentFile(file);
          newLines.push(`ABRIENDO ${file.nombre.toUpperCase()}...`);
        } else {
          newLines.push(`ERROR: ARCHIVO '${fileName}' NO ENCONTRADO.`);
        }
      }
      else if (cleanCmd === 'clear') {
        setOutput([]);
        setCommand('');
        return;
      }
      else {
        newLines.push(`COMANDO NO RECONOCIDO: ${cleanCmd}`);
      }

      setOutput(prev => [...prev, ...newLines]);
      setCommand('');
    }
  };

  return (
    <div className="scanlines relative bg-terminal-dark border-2 border-terminal-green shadow-terminal animate-terminal-flicker w-full max-w-4xl h-[600px] flex flex-col font-mono rounded-lg overflow-hidden">
      
      {/* Capa de brillo CRT */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-10 z-10"></div>

      <div ref={terminalRef} className="flex-grow p-6 overflow-y-auto z-20 space-y-1">
        {output.map((line, i) => (
          <p key={i} className="text-terminal-green uppercase tracking-widest text-sm md:text-base">
            {line.startsWith('ERROR') ? (
              <span className="text-terminal-red">{line}</span>
            ) : line}
          </p>
        ))}
        
        {!currentFile && (
          <div className="flex text-terminal-green uppercase tracking-widest">
            <span className="mr-2">{prefix}</span>
            <input
              autoFocus
              className="bg-transparent border-none outline-none flex-grow text-terminal-green"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleCommand}
              disabled={isTyping}
            />
            <span className="animate-cursor-blink">|</span>
          </div>
        )}
      </div>

      {currentFile && (
        <ArchivoDisplay 
          file={currentFile} 
          onClose={() => setCurrentFile(null)} 
        />
      )}
    </div>
  );
};

export default Terminal;