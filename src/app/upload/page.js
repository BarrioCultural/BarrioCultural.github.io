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
  const [categoria, setCategoria] = useState('dibujos'); // dibujos o fotos
  const [titulo, setTitulo] = useState('');

  // Protección: Si no es admin, lo mandamos a casa
  if (!perfil || perfil.rol !== 'admin') {
    return <div className="p-20 text-center text-white">No tienes permiso para estar aquí.</div>;
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo");

    setLoading(true);
    try {
      // 1. Subir imagen a Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('galeria')
        .upload(`${categoria}/${fileName}`, file);

      if (storageError) throw storageError;

      // 2. Obtener la URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(`${categoria}/${fileName}`);

      // 3. Guardar en la tabla correspondiente (dibujos o fotos)
      const { error: dbError } = await supabase
        .from(categoria)
        .insert([{ 
          url: publicUrl, 
          titulo: titulo,
          usuario_id: user.id 
        }]);

      if (dbError) throw dbError;

      alert("¡Subido con éxito!");
      router.push(`/${categoria}`); // Te lleva a ver tu nueva obra
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-bg-main">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">SUBIR NUEVA OBRA</h1>
        
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Selector de categoría */}
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Categoría</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setCategoria('dibujos')}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs ${categoria === 'dibujos' ? 'bg-accent text-black border-accent' : 'border-white/10 text-white'}`}
              >DIBUJOS</button>
              <button 
                type="button"
                onClick={() => setCategoria('fotos')}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs ${categoria === 'fotos' ? 'bg-accent text-black border-accent' : 'border-white/10 text-white'}`}
              >FOTOS</button>
            </div>
          </div>

          <input 
            type="text" 
            placeholder="Título (opcional)"
            className="w-full bg-black/20 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-accent"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-accent"
          />

          <button 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
          >
            {loading ? 'Subiendo...' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;