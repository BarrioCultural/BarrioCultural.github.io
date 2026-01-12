const CommentsSection = ({ imagenId }) => {
  // CORRECCIÓN: Usamos la ruta real de tu proyecto
  const { user, perfil } = useAuth(); 
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      setComentarios([]); // LIMPIEZA: Para no ver comentarios de la foto anterior
      const { data, error } = await supabase
        .from('comentarios')
        .select(`*, perfiles ( nombre, avatar_url )`)
        .eq('imagen_id', imagenId)
        .order('created_at', { ascending: false });

      if (!error) setComentarios(data);
    };

    if (imagenId) fetchComentarios();
  }, [imagenId]);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !user || enviando) return;

    setEnviando(true);
    
    // Agregamos un bloque para capturar el error
    const { data, error } = await supabase
      .from('comentarios')
      .insert([
        { 
          texto: nuevoComentario, 
          user_id: user.id, 
          perfil_id: user.id, 
          imagen_id: String(imagenId) // Aseguramos que sea string
        }
      ])
      .select(`*, perfiles ( nombre )`)
      .single();

    if (error) {
      // SI NO SE ENVÍA, MIRA LA CONSOLA (F12) Y VERÁS ESTE MENSAJE:
      console.error("ERROR AL ENVIAR:", error.message);
      alert("No se pudo enviar: " + error.message);
    } else {
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
            type="submit" // ASEGÚRATE DE QUE TENGA TYPE SUBMIT
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

      {/* Render de comentarios igual... */}
      <div className="space-y-6">
        {comentarios.map((c) => (
          <div key={c.id} className="border-l border-white/5 pl-4">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-white text-xs font-bold uppercase tracking-tighter">
                {c.perfiles?.nombre || "Usuario"}
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