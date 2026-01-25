import Criaturas from "@/components/paginas/criaturas";
import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();

  // 1. Intentamos la consulta
  const { data, error } = await supabase.from('criaturas').select('*');

  // 2. Si hay un error de Supabase, lo mostramos en grande
  if (error) {
    return <div className="p-20 bg-black text-red-500 font-mono">
      <h1>ERROR DE SUPABASE:</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>;
  }

  // 3. Si no hay datos, revisamos si es que la tabla está vacía o las llaves fallan
  if (!data || data.length === 0) {
    return <div className="p-20 bg-black text-yellow-500 font-mono">
      <h1>CONECTADO, PERO NO HAY DATOS</h1>
      <p>URL definida: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "SÍ" : "NO"}</p>
      <p>Key definida: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SÍ" : "NO"}</p>
    </div>;
  }

  return <Criaturas initialData={data} />;
}