import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'Bestiario | Franilover',
  description: 'Colección de criaturas y entidades descubiertas.',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();

  // Traemos todo de un solo golpe en el servidor
  const { data: iniciales } = await supabase
    .from('criaturas')
    .select('*')
    .order('nombre', { ascending: true });

  return <Criaturas initialData={iniciales || []} />;
}