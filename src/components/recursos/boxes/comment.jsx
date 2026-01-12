import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext'; // Ajusta la ruta a tu AuthContext

const CommentsSection = ({ imagenId }) => {
  const { user, perfil } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  // 1. Cargar comentarios de esta imagen específica
  useEffect(() => {
    const fetchComentarios = async () => {
      const { data, error } = await supabase
        .from('comentarios')
        .select(`
          *,
          perfiles ( nombre, avatar_url ) 
        `) // Traemos los datos del autor haciendo un join con tu tabla perfiles
        .eq('imagen_id', imagenId)
        .order('created_at', { ascending: false });

      if (!error) setComentarios(data);
    };

    if (imagenId) fetchComentarios();
  }, [imagenId]);

  // 2. Función para guardar en Supabase
  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !user || enviando) return;

    setEnviando(true);
    const { data, error } = await supabase
      .from('comentarios')
      .insert([
        { 
          texto: nuevoComentario, 
          user_id: user.id, 
          perfil_id: user.id, // Suponiendo que el ID de perfil es el mismo que el de Auth
          imagen_id: imagenId 
        }
      ])
      .select(`*, perfiles ( nombre )`)
      .single();

    if (!error) {
      setComentarios([data, ...comentarios]);
      setNuevoComentario("");
    }
    setEnviando(false);
  };

  return (
    <div className="w-full max-w-2xl mt-10 pb-20">
      <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-2">
        Conversación ({comentarios.length})
      </h3>

      {user ? (
        <form onSubmit={enviarComentario} className="mb-8 flex gap-3">
          <input 
            type="text"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder={`Comentar como ${perfil?.nombre || 'usuario'}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40"
            disabled={enviando}
          />
          <button 
            disabled={enviando}
            className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {enviando ? "..." : "PUBLICAR"}
          </button>
        </form>
      ) : (
        <p className="text-white/30 text-[10px] uppercase text-center mb-8">
          Inicia sesión para participar
        </p>
      )}

      <div className="space-y-6">
        {comentarios.map((c) => (
          <div key={c.id} className="border-l border-white/5 pl-4">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-white text-xs font-bold uppercase tracking-tighter">
                {c.perfiles?.nombre || "Usuario Anónimo"}
              </span>
              <span className="text-white/20 text-[9px] font-mono">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/60 text-sm font-light leading-relaxed">{c.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
};