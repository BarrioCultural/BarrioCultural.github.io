import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server'; // Apuntando al nuevo archivo

export const metadata = {
  title: 'Bestiario | Franilover',
  description: 'Colección de criaturas y entidades descubiertas.',
};

// ESTA LÍNEA ES TU MEJOR AMIGA: 
// Obliga a la página a pedir datos nuevos a Supabase en cada visita.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabaseServer = createClient();

  // Traemos los datos en el servidor
  const { data: iniciales } = await supabaseServer
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  // Se los pasamos al componente de cliente que ya tienes hecho
  return <Criaturas initialData={iniciales || []} />;
}