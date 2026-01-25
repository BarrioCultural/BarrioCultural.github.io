import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server';

export const metadata = {
  title: 'Bestiario | Franilover',
  description: 'Colección de criaturas y entidades descubiertas.',
};

// Evita que Vercel guarde una copia vieja
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();

  // Traemos los datos. Si esto falla, mandamos un array vacío.
  const { data: iniciales, error } = await supabase
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) console.error("Error en servidor:", error);

  // Le pasamos los datos al componente
  return <Criaturas initialData={iniciales || []} />;
}