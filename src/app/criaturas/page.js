import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();
  
  // Intentamos traer los datos
  const { data: iniciales, error } = await supabase
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error("Error en servidor:", error);
    return <Criaturas initialData={[]} />;
  }

  return <Criaturas initialData={iniciales || []} />;
}