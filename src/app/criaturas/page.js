import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server';

export const metadata = {
  title: 'Bestiario | Franilover',
  description: 'Colección de criaturas y entidades descubiertas.',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();

  const { data: iniciales } = await supabase
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  // Pasamos los datos al componente como "initialData"
  return <Criaturas initialData={iniciales || []} />;
}