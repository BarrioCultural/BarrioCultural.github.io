"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/authContext';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';

const UploadPage = () => {
  const { perfil } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState('dibujos'); // dibujos o fotos
  const [titulo, setTitulo] = useState('');

  if (!perfil || perfil.rol !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main text-primary italic font-medium">
        Acceso restringido. Solo administradores.
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor, selecciona un archivo");

    setLoading(true);
    try {
      const tablaDestino = categoria === 'dibujos' ? 'dibujos' : 'diario_fotos';

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${categoria}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from(tablaDestino)
        .insert([{ 
          url_imagen: publicUrl,
          titulo: titulo || 'Sin título',
          categoria: 'original' 
        }]);

      if (dbError) throw dbError;

      alert("¡Publicado con éxito! ✨");
      router.push(categoria === 'dibujos' ? '/dibujos' : '/fotos');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-bg-main">
      <div className="w-full max-w-md bg-primary/5 backdrop-blur-sm border border-primary/10 p-8 rounded-3xl relative animate-in fade-in duration-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Subir nueva obra</h1>
          <p className="text-primary/60 text-sm">Comparte algo lindo con el mundo</p>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Selector de Categoría Estilo Newsletter */}
          <div className="flex gap-2 p-1.5 bg-bg-main/50 rounded-2xl border border-primary/10">
            <button 
              type="button"
              onClick={() => setCategoria('dibujos')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${categoria === 'dibujos' ? 'bg-primary text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
            >
              <ImageIcon size={16} /> DIBUJO
            </button>
            <button 
              type="button"
              onClick={() => setCategoria('fotos')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${categoria === 'fotos' ? 'bg-primary text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
            >
              <Camera size={16} /> FOTO
            </button>
          </div>

          {/* Campo Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-primary/70 ml-1">Título de la obra</label>
            <input 
              type="text" 
              placeholder="Ej: Atardecer en el jardín..."
              className="w-full bg-bg-main border border-primary/20 rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Área de Dropzone/Upload */}
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${file ? 'border-primary/40 bg-primary/5' : 'border-primary/10 group-hover:border-primary/30 bg-bg-main/30'}`}>
               <Upload className={file ? "text-primary" : "text-primary/20"} size={32} />
               <span className="text-primary/60 text-xs font-medium px-4 text-center">
                 {file ? file.name : "Haz clic o arrastra una imagen aquí"}
               </span>
            </div>
          </div>

          {/* Botón Publicar */}
          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {loading ? 'Subiendo...' : 'Publicar Obra'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;