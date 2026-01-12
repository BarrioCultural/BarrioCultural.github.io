"use client";
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/recursos/control/authContext';

// --- 1. CONTEXTO DEL LIGHTBOX ---
const LightboxContext = createContext();

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) throw new Error("useLightbox debe usarse dentro de LightboxProvider");
  return context;
};

// --- 2. COMPONENTE: BOTÓN COMPARTIR ---
const ShareButton = ({ url, titulo }) => {
  const [copiado, setCopiado] = useState(false);
  
  const handleShare = async (e) => {
    e.stopPropagation(); 
    const fullUrl = window.location.origin + url;
    if (navigator.share) {
      try { await navigator.share({ title: titulo || "Mi Dibujo", url: fullUrl }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all active:scale-95">
      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
        {copiado ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  );
};

// --- 3. COMPONENTE: SECCIÓN DE COMENTARIOS ---
const CommentsSection = ({ imagenId }) => {
  const { user, perfil } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      setComentarios([]); 
      const { data, error } = await supabase
        .from('comentarios')
        .select(`*, perfiles ( nombre )`)
        .eq('imagen_id', imagenId)
        .order('created_at', { ascending: false });
      
      if (!error && data) setComentarios(data);
    };

    if (imagenId) fetchComentarios();
  }, [imagenId]);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !user || enviando) return;

    setEnviando(true);
    const { data, error } = await supabase
      .from('comentarios')
      .insert([{ 
        texto: nuevoComentario, 
        user_id: user.id, 
        perfil_id: user.id, 
        imagen_id: imagenId 
      }])
      .select(`*, perfiles ( nombre )`)
      .single();

    if (!error && data) {
      setComentarios([data, ...comentarios]);
      setNuevoComentario("");
    }
    setEnviando(false);
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-2">
        Conversación ({comentarios.length})
      </h3>

      {user ? (
        <form onSubmit={enviarComentario} className="mb-10 flex gap-3">
          <input 
            type="text"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder={`Escribe como ${perfil?.nombre || 'usuario'}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
          />
          <button 
            type="submit"
            disabled={enviando}
            className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            {enviando ? "..." : "ENVIAR"}
          </button>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Inicia sesión para comentar</p>
        </div>
      )}

      <div className="space-y-8 pb-20">
        {comentarios.map((c) => (
          <div key={c.id} className="group animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-[11px] font-bold uppercase tracking-tight">
                {c.perfiles?.nombre || "Usuario"}
              </span>
              <span className="text-white/20 text-[9px] font-mono">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/70 text-sm font-light leading-relaxed border-l border-white/10 pl-4">
              {c.texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. VISUALIZADOR PRINCIPAL ---
const LightboxVisual = () => {
  const { selectedImg, gallery, currentIndex, setCurrentIndex, closeLightbox } = useLightbox();

  if (!selectedImg) return null;
  const imgId = selectedImg.id || selectedImg.src;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/98 backdrop-blur-2xl overflow-y-auto selection:bg-white selection:text-black">
      
      {/* Barra Superior */}
      <div className="sticky top-0 w-full p-4 md:p-6 flex justify-between items-center z-[110] bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] truncate max-w-[150px] md:max-w-[300px]">
            {selectedImg.alt || "Obra sin título"}
          </h2>
          <span className="text-white/30 text-[9px] font-mono mt-1">
            {currentIndex + 1} / {gallery.length}
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <ShareButton url={selectedImg.src} titulo={selectedImg.alt} />
          <button onClick={closeLightbox} className="text-white/40 hover:text-white text-4xl font-thin transition-colors">&times;</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-[1900px] mx-auto flex-1">
        
        {/* LADO IZQUIERDO: Imagen + Accesorios */}
        <div className="flex-1 flex flex-col items-center w-full lg:border-r lg:border-white/5">
          
          {/* VISOR DE IMAGEN (Reducido levemente el padding para acercar elementos) */}
          <div className="relative flex items-center justify-center w-full min-h-[50vh] md:min-h-[80vh] px-2 md:px-10 py-4 md:py-8">
            <button 
              className="absolute left-2 md:left-4 z-[105] text-white/20 hover:text-white text-5xl md:text-8xl p-2 transition-all"
              onClick={() => setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length)}
            >‹</button>

            <img 
              key={selectedImg.src}
              src={selectedImg.src} 
              alt={selectedImg.alt} 
              className="max-h-[70vh] md:max-h-[78vh] max-w-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm animate-in zoom-in-95 duration-500"
            />

            <button 
              className="absolute right-2 md:right-4 z-[105] text-white/20 hover:text-white text-5xl md:text-8xl p-2 transition-all"
              onClick={() => setCurrentIndex((currentIndex + 1) % gallery.length)}
            >›</button>
          </div>

          {/* MINIATURAS EN MÓVIL (Más grandes y pegadas a la imagen) */}
          <div className="lg:hidden w-full px-4 mb-10">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 border-y border-white/5 bg-white/[0.02] rounded-xl px-4">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-20 w-20 min-w-[80px] rounded-lg overflow-hidden transition-all duration-300 ${
                    idx === currentIndex ? 'ring-2 ring-white scale-105 opacity-100' : 'opacity-30 grayscale'
                  }`}
                >
                  <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* COMENTARIOS */}
          <CommentsSection imagenId={imgId} />
        </div>

        {/* COLUMNA DERECHA (Desktop - Más pegada y con miniaturas grandes) */}
        <div className="hidden lg:flex flex-col items-center gap-4 p-4 bg-black/10 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto no-scrollbar w-[110px]">
          {gallery.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-20 w-20 min-h-[80px] rounded-xl overflow-hidden transition-all duration-300 ${
                idx === currentIndex ? 'ring-2 ring-white scale-110 opacity-100 shadow-2xl' : 'opacity-20 grayscale hover:opacity-100'
              }`}
            >
              <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 5. PROVIDER (Sin cambios) ---
export const LightboxProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const openLightbox = useCallback((index, images) => {
    setGallery(images);
    setCurrentIndex(index);
    if (typeof window !== 'undefined') document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setCurrentIndex(-1);
    setGallery([]);
    if (typeof window !== 'undefined') document.body.style.overflow = 'auto';
  }, []);

  return (
    <LightboxContext.Provider value={{ selectedImg: gallery[currentIndex], gallery, currentIndex, setCurrentIndex, openLightbox, closeLightbox }}>
      {children}
      <LightboxVisual />
    </LightboxContext.Provider>
  );
};