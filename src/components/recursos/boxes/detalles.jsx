"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Edit3, Save, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Relaciones from './relaciones';

export default function DetalleMaestro({ 
  isOpen, 
  onClose, 
  data, 
  tags = [], 
  mostrarMusica = true 
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados para los campos editables
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  // Verificar si el usuario es admin al abrir
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsAdmin(true);
    };
    checkUser();
  }, []);

  // Resetear campos cuando cambia el personaje/criatura seleccionada
  useEffect(() => {
    if (data) {
      setEditNombre(data.nombre || "");
      setEditDescripcion(data.sobre || data.descripcion || "");
      setEditMode(false);
    }
  }, [data]);

  if (!data) return null;

  const imagen = data.img_url || data.imagen_url;
  const tabla = data.img_url ? 'personajes' : 'criaturas'; // Detectamos la tabla automáticamente

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        nombre: editNombre,
        [data.sobre ? 'sobre' : 'descripcion']: editDescripcion
      };

      const { error } = await supabase
        .from(tabla)
        .update(updates)
        .eq('id', data.id);

      if (error) throw error;
      
      // Actualizamos visualmente sin recargar
      data.nombre = editNombre;
      if (data.sobre) data.sobre = editDescripcion; else data.descripcion = editDescripcion;
      
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const listaLinks = Array.isArray(data.canciones) 
    ? data.canciones.flatMap(item => typeof item === 'string' ? item.split(',') : item)
                   .map(link => link.trim())
                   .filter(link => link !== "")
    : [];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          key={data.id}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="max-w-7xl mx-auto mb-16 relative pt-4 px-4"
        >
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px] relative">
            
            {/* BOTONES DE CONTROL (CERRAR Y EDITAR) */}
            <div className="absolute top-6 right-6 z-50 flex gap-2">
              {isAdmin && !editMode && (
                <button onClick={() => setEditMode(true)} className="p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Edit3 size={20} />
                </button>
              )}
              {editMode && (
                <button onClick={handleSave} disabled={saving} className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 px-5">
                  <Save size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{saving ? '...' : 'Guardar'}</span>
                </button>
              )}
              <button 
                onClick={onClose} 
                className="p-3 bg-bg-main text-primary rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-md"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* IMAGEN */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-white to-primary/5 flex items-center justify-center p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-primary/5">
              <div className="relative w-full aspect-square max-w-[400px]">
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-3 scale-105" />
                <img 
                  src={imagen} 
                  alt={editNombre} 
                  className="relative z-10 w-full h-full object-contain mix-blend-multiply rounded-[3.5rem] transform transition-transform duration-500" 
                />
              </div>
            </div>

            {/* CONTENIDO TEXTUAL */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:pl-10 lg:pr-16 flex flex-col justify-center bg-bg-main/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => tag && (
                  <span key={i} className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>

              {editMode ? (
                <div className="space-y-4 mb-6">
                  <input 
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className="text-4xl md:text-5xl font-black uppercase italic text-primary w-full bg-white border-2 border-primary/20 p-4 rounded-2xl outline-none focus:border-primary"
                    placeholder="Nombre del personaje..."
                  />
                  <textarea 
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    className="text-primary/80 text-base italic leading-snug w-full bg-white border-2 border-primary/20 p-4 rounded-2xl outline-none focus:border-primary min-h-[150px]"
                    placeholder="Escribe su historia..."
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic text-primary leading-[0.85] tracking-tighter mb-6 break-words">
                    {editNombre}
                  </h2>
                  <p className="text-primary/80 text-base md:text-lg italic leading-snug mb-4 whitespace-pre-wrap">
                    {editDescripcion}
                  </p>
                </>
              )}

              {/* RELACIONES Y MÚSICA (Solo se muestran si no estamos editando para no saturar) */}
              {!editMode && (
                <>
                  <div className="mb-8">
                    <Relaciones nombrePersonaje={editNombre} />
                  </div>

                  {mostrarMusica && listaLinks.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary/30 mb-2">
                        <Music size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">¿Quieres descubrir más?</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {listaLinks.map((link, index) => (
                          <motion.a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-white border-2 border-primary/10 px-6 py-3 rounded-2xl shadow-sm"
                          >
                            <span className="text-sm font-black italic uppercase text-primary tracking-tighter">
                              {editNombre} {index + 1}
                            </span>
                            <Music size={16} className="text-primary/40" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}