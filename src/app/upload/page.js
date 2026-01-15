"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/recursos/control/authContext';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Camera, ChevronDown, X, Sparkles, UserCircle, Link as LinkIcon } from 'lucide-react';

const CONFIG_ESTRUCTURA = {
  personal: {
    label: 'Personal',
    tablas: {
      dibujos: {
        label: 'Dibujos',
        icon: <ImageIcon size={14} />,
        categorias: ['original', 'fanart', 'bocetos']
      },
      diario_fotos: {
        label: 'Fotos',
        icon: <Camera size={14} />,
        categorias: ['yo', 'amigos', 'animales', 'paisajes']
      }
    }
  },
  garden_of_sins: {
    label: 'Garden of Sins',
    tablas: {
      criaturas: {
        label: 'Criaturas',
        icon: <Sparkles size={14} />,
        categorias: ['terrestres', 'voladoras', 'acuáticas']
      },
      personajes: {
        label: 'Personajes',
        icon: <UserCircle size={14} />,
        categorias: ['Caelistan', 'Greendom', 'Omnisia', 'Aelistan', 'Otros']
      }
    }
  }
};

const UploadPage = () => {
  const { perfil } = useAuth();
  const router = useRouter();
  
  const [seccion, setSeccion] = useState('personal');
  const [tabla, setTabla] = useState('dibujos'); 
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [loading, setLoading] = useState(false);
  const [nombreObra, setNombreObra] = useState('');
  const [categoria, setCategoria] = useState(CONFIG_ESTRUCTURA.personal.tablas.dibujos.categorias[0]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!perfil || (perfil.rol !== 'admin' && perfil.rol !== 'autor')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2D8E6] text-[#6B5E70] italic font-medium">
        Acceso restringido. Solo personal autorizado.
      </div>
    );
  }

  const handleCambioSeccion = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
    const primeraTabla = Object.keys(CONFIG_ESTRUCTURA[nuevaSeccion].tablas)[0];
    setTabla(primeraTabla);
    setCategoria(CONFIG_ESTRUCTURA[nuevaSeccion].tablas[primeraTabla].categorias[0]);
  };

  const handleCambioTabla = (nuevaTabla) => {
    setTabla(nuevaTabla);
    setCategoria(CONFIG_ESTRUCTURA[seccion].tablas[nuevaTabla].categorias[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadMethod === 'file' && !file) return alert("Selecciona un archivo");
    if (uploadMethod === 'url' && !externalUrl) return alert("Pega una URL válida");

    setLoading(true);
    try {
      let finalImageUrl = externalUrl;

      if (uploadMethod === 'file') {
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
        
        finalImageUrl = publicUrl;
      }

      // --- LÓGICA DE COLUMNAS DINÁMICAS ---
      let insertData = {};

      if (seccion === 'personal') {
        // Estructura para Dibujos y Fotos (basado en tu captura)
        insertData = {
          titulo: nombreObra || 'Sin título',
          url_imagen: finalImageUrl,
          categoria: categoria
        };
      } else {
        // Estructura para Garden of Sins (Criaturas y Personajes)
        insertData = {
          nombre: nombreObra || 'Sin nombre',
          imagen_url: finalImageUrl,
          categoria: categoria
        };
      }

      const { error: dbError } = await supabase.from(tabla).insert([insertData]);

      if (dbError) throw dbError;

      alert("¡Publicado con éxito! ✨");
      setNombreObra('');
      setFile(null);
      setExternalUrl('');
      router.refresh(); 
      
    } catch (error) {
      console.error("Error completo:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-[#E2D8E6]">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-[#6B5E70]/10 p-8 rounded-[2.5rem] shadow-xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#6B5E70] tracking-tight italic">Nueva Publicación</h1>
          <p className="text-[#6B5E70]/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Gestión de Contenido</p>
        </div>

        <div className="flex gap-4 mb-6 border-b border-[#6B5E70]/10 pb-4">
          {Object.keys(CONFIG_ESTRUCTURA).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCambioSeccion(key)}
              className={`text-[11px] font-black uppercase tracking-widest transition-all ${seccion === key ? 'text-[#6B5E70] border-b-2 border-[#6B5E70]' : 'text-[#6B5E70]/30 hover:text-[#6B5E70]/50'}`}
            >
              {CONFIG_ESTRUCTURA[key].label}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex gap-2 p-1.5 bg-[#6B5E70]/5 rounded-2xl border border-[#6B5E70]/10">
            {Object.entries(CONFIG_ESTRUCTURA[seccion].tablas).map(([key, value]) => (
              <button 
                key={key}
                type="button" 
                onClick={() => handleCambioTabla(key)} 
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tabla === key ? 'bg-[#6B5E70] text-white shadow-md' : 'text-[#6B5E70]/40'}`}
              >
                {value.icon} {value.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-6">
            <button type="button" onClick={() => setUploadMethod('file')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${uploadMethod === 'file' ? 'text-[#6B5E70]' : 'text-[#6B5E70]/30'}`}>
              <Upload size={12}/> Archivo
            </button>
            <button type="button" onClick={() => setUploadMethod('url')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${uploadMethod === 'url' ? 'text-[#6B5E70]' : 'text-[#6B5E70]/30'}`}>
              <LinkIcon size={12}/> URL
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Nombre / Título</label>
              <input 
                type="text" 
                className="w-full bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] outline-none font-medium" 
                value={nombreObra} 
                onChange={(e) => setNombreObra(e.target.value)} 
                placeholder="Ej: Personaje original o Criatura..." 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/70 ml-1">Categoría</label>
              <div className="relative">
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)} 
                  className="w-full appearance-none bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] font-bold text-xs uppercase tracking-widest outline-none"
                >
                  {CONFIG_ESTRUCTURA[seccion].tablas[tabla].categorias.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E70]/40 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {uploadMethod === 'file' ? (
            <div className="relative group">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`w-full py-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all ${file ? 'border-[#6B5E70]/40 bg-[#6B5E70]/5' : 'border-[#6B5E70]/10 bg-white/20'}`}>
                {previewUrl ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-inner border border-[#6B5E70]/20">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white"><X size={14}/></button>
                  </div>
                ) : (
                  <>
                    <Upload className="text-[#6B5E70]/20" size={28} />
                    <span className="text-[#6B5E70]/60 text-[10px] font-black uppercase">Click para subir</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full bg-white/50 border border-[#6B5E70]/10 rounded-2xl px-4 py-3 text-[#6B5E70] outline-none font-medium"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          )}

          <button disabled={loading} className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Subiendo...' : 'Publicar Ahora'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadPage;