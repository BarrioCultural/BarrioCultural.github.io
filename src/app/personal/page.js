import Personal from "@/components/paginas/personal";
import { supabase } from '@/lib/supabase'; // 1. Importas el objeto directamente

export default async function Page() {
  
  // 3. Usa "supabase" directamente para la consulta
  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select(`
      username,
      email,
      descubrimientos ( criaturas ( nombre, imagen_url ) ),
      inventario_usuario ( equipado, items ( nombre, habilidad, tipo ) )
    `)
    .eq('username', 'Franilover')
    .single();

  if (error) {
    return <div className="text-white pt-40 text-center">Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-bg-main">
      <Personal datos={perfil} />
    </main>
  );
}