"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/recursos/control/authContext';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Camera, ChevronDown, Calendar } from 'lucide-react';

// 1. Definimos las categorías por tabla
const CATEGORIAS_POR_TABLA = {
  dibujos: ['original', 'fanart', 'bocetos'],
  diario_fotos: ['yo', 'amigos', 'animales', 'paisajes']
};

const UploadPage = () => {
  const { perfil } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabla, setTabla] = useState('dibujos'); 
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('original');
  const [fecha, setFecha] = useState(''); // Estado para la fecha (útil para el diario)

  // Solo admin o autor pueden subir (según tus instrucciones de cuenta autorizada)
  if (!perfil || (perfil.rol !== 'admin' && perfil.rol !== 'autor')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2D8E6] text-[#6B5E70] italic font-medium">
        Acceso restringido. Solo personal autorizado.
      </div>
    );
  }

  // Cambiar categorías según la tabla seleccionada
  const handleCambioTabla = (nuevaTabla) => {
    setTabla(nuevaTabla);
    setCategoria(CATEGORIAS_POR_TABLA[nuevaTabla][0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor, selecciona un archivo");

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${tabla}/${fileName}`;

      // 1. Subir imagen al Storage
      const { error: storageError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(filePath);

      // 3. Insertar en la DB (Ajustado para diario_fotos y dibujos)
      const insertData = { 
        url_imagen: publicUrl,
        titulo: titulo || 'Sin título',
        categoria: categoria 
      };

      // Si es foto del diario, incluimos la fecha si se puso una
      if (tabla === 'diario_fotos' && fecha) {
        insertData.fecha = fecha;
      }

      const { error: dbError } = await supabase
        .from(tabla)
        .insert([insertData]);

      if (dbError) throw dbError;

      alert("¡Publicado con éxito! ✨");
      
      // Redirigir según lo que se subió
      router.push(tabla === 'dibujos' ? '/dibujos' : '/diario');
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-[#E2D8E6]">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-[#6B5E70]/10 p-8 rounded-[2.5rem] shadow-xl animate-in fade-in duration-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#6B5E70] tracking-tight italic">Subir nueva obra</h1>
          <p className="text-[#6B5E70]/60 text-xs font-bold uppercase tracking-widest mt-1">Panel de Control</p>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-6">
          
          {/* Selector de Tabla (Dibujo o Foto) */}
          <div className="flex gap-2 p-1.5 bg-[#6B5E70]/5 rounded-2xl border border-[#6B5E70]/10">
            <button 
              type="button"
              onClick={() => handleCambioTabla('dibujos')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tabla === 'dibujos' ? 'bg-[#6B5E70] text-white shadow-md' : 'text-[#6B5E70]/40'}`}
            >
              <ImageIcon size={14} /> DIBUJO
            </button>
            <button 
              type="button"
              onClick={() => handleCambioTabla('diario_fotos')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tabla === 'diario_fotos' ? 'bg-[#6B5E70] text-white shadow-md' : 'text-[#6B5E70]/40'}`}
            >
              <Camera size={14} /> FOTO
            </button>
          </div>

          {/* Campo Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Título / Pie de foto</label>
            <input 
              type="text" 
              placeholder={tabla === 'dibujos' ? "Ej: Star Girl..." : "Ej: Un día en el parque..."}
              className="w-full bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] placeholder:text-[#6B5E70]/30 outline-none focus:ring-2 focus:ring-[#6B5E70]/20 transition-all font-medium"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Selector de Categoría DINÁMICO */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Categoría</label>
            <div className="relative">
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full appearance-none bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] outline-none focus:ring-2 focus:ring-[#6B5E70]/20 transition-all font-bold text-xs uppercase tracking-widest"
              >
                {CATEGORIAS_POR_TABLA[tabla].map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E70]/40 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Campo Fecha (Solo aparece si es Foto) */}
          {tabla === 'diario_fotos' && (
            <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Fecha del recuerdo</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ej: 12 de Octubre, 2024"
                  className="w-full bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] placeholder:text-[#6B5E70]/30 outline-none focus:ring-2 focus:ring-[#6B5E70]/20 transition-all font-medium"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E70]/20 pointer-events-none" size={16} />
              </div>
            </div>
          )}

          {/* Área de Archivo */}
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full py-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all ${file ? 'border-[#6B5E70]/40 bg-[#6B5E70]/5' : 'border-[#6B5E70]/10 bg-white/20'}`}>
               <Upload className={file ? "text-[#6B5E70]" : "text-[#6B5E70]/20"} size={28} />
               <span className="text-[#6B5E70]/60 text-[10px] font-black uppercase tracking-tighter px-4 text-center">
                 {file ? file.name : "Seleccionar Imagen"}
               </span>
            </div>
          </div>

          {/* Botón Publicar */}
          <button 
            disabled={loading}
            className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#6B5E70]/20"
          >
            {loading ? 'Subiendo...' : 'Publicar Ahora'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;