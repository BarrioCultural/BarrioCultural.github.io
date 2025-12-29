"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/recursos/authContext';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Camera, ChevronDown } from 'lucide-react';

const UploadPage = () => {
  const { perfil } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabla, setTabla] = useState('dibujos'); // dibujos o diario_fotos
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('original'); // Categoría de la DB

  // Colores basados en tu captura
  const colors = {
    fondoLavanda: "#E2D8E6",
    lavandaOscuro: "#6B5E70",
    bordeInput: "rgba(107, 94, 112, 0.2)"
  };

  // Solo admin o autor pueden subir según tus instrucciones previas
  if (!perfil || (perfil.rol !== 'admin' && perfil.rol !== 'autor')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2D8E6] text-[#6B5E70] italic font-medium">
        Acceso restringido. Solo personal autorizado.
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor, selecciona un archivo");

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${tabla}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from(tabla)
        .insert([{ 
          url_imagen: publicUrl,
          titulo: titulo || 'Sin título',
          categoria: categoria 
        }]);

      if (dbError) throw dbError;

      alert("¡Publicado con éxito! ✨");
      router.push(tabla === 'dibujos' ? '/dibujos' : '/fotos');
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
              onClick={() => setTabla('dibujos')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tabla === 'dibujos' ? 'bg-[#6B5E70] text-white shadow-md' : 'text-[#6B5E70]/40'}`}
            >
              <ImageIcon size={14} /> DIBUJO
            </button>
            <button 
              type="button"
              onClick={() => setTabla('fotos')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tabla === 'fotos' ? 'bg-[#6B5E70] text-white shadow-md' : 'text-[#6B5E70]/40'}`}
            >
              <Camera size={14} /> FOTO
            </button>
          </div>

          {/* Campo Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Título</label>
            <input 
              type="text" 
              placeholder="Ej: Star Girl..."
              className="w-full bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] placeholder:text-[#6B5E70]/30 outline-none focus:ring-2 focus:ring-[#6B5E70]/20 transition-all font-medium"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* SELECTOR DE CATEGORÍA (NUEVO) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Categoría</label>
            <div className="relative">
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full appearance-none bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] outline-none focus:ring-2 focus:ring-[#6B5E70]/20 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <option value="original">Original</option>
                <option value="fanart">Fanart</option>
                <option value="bocetos">Bocetos</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E70]/40 pointer-events-none" size={16} />
            </div>
          </div>

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
                 {file ? file.name : "Subir imagen"}
               </span>
            </div>
          </div>

          {/* Botón Publicar */}
          <button 
            disabled={loading}
            className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#6B5E70]/20"
          >
            {loading ? 'Subiendo...' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;