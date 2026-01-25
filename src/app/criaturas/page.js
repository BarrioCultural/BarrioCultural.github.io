import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();

  // Traemos los datos en el servidor para que no haya 'loading' en el cliente
  const { data: iniciales } = await supabase
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  // IMPORTANTE: Pasamos los datos como 'initialData'
  return <Criaturas initialData={iniciales || []} />;
}