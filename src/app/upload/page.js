"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/authContext';
import { useRouter } from 'next/navigation';

const UploadPage = () => {
  const { user, perfil } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState('dibujos'); // dibujos o diario_fotos
  const [titulo, setTitulo] = useState('');

  if (!perfil || perfil.rol !== 'admin') {
    return <div className="p-20 text-center text-white italic">Acceso restringido.</div>;
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo");

    setLoading(true);
    try {
      const tablaDestino = categoria === 'dibujos' ? 'dibujos' : 'diario_fotos';

      // 2. Subir imagen a Storage (Asegúrate que el bucket se llame 'galeria')
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${categoria}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 3. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(filePath);

      // 4. Insertar en Base de Datos con los nombres de columna EXACTOS de tu captura
      const { error: dbError } = await supabase
        .from(tablaDestino)
        .insert([{ 
          url_imagen: publicUrl, // En tu captura la columna se llama url_imagen, no url
          titulo: titulo || 'Sin título',
          categoria: 'original' // O la que prefieras por defecto
        }]);

      if (dbError) throw dbError;

      alert("¡Publicado con éxito!");
      router.push(categoria === 'dibujos' ? '/dibujos' : '/fotos');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-bg-main">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
        <h1 className="text-2xl font-black text-white mb-6 tracking-tighter italic">SUBIR OBRA</h1>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
            <button 
              type="button"
              onClick={() => setCategoria('dibujos')}
              className={`flex-1 py-3 rounded-lg font-bold text-[10px] tracking-widest transition-all ${categoria === 'dibujos' ? 'bg-accent text-black shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]' : 'text-white/40 hover:text-white'}`}
            >DIBUJOS</button>
            <button 
              type="button"
              onClick={() => setCategoria('fotos')}
              className={`flex-1 py-3 rounded-lg font-bold text-[10px] tracking-widest transition-all ${categoria === 'fotos' ? 'bg-accent text-black shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]' : 'text-white/40 hover:text-white'}`}
            >FOTOS</button>
          </div>

          <input 
            type="text" 
            placeholder="Escribe un título..."
            className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-accent/50 transition-all"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full py-10 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-accent/30 transition-all">
               <span className="text-white/40 text-xs">{file ? file.name : "Seleccionar Imagen"}</span>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-accent transition-all disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;