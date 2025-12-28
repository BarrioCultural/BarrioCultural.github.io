import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Exportamos el cliente solo si las variables existen de verdad
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Un pequeño log para ayudarte a ver en la consola de Vercel (Logs) si se cargaron
if (!supabase) {
  console.error("❌ Error: No se detectaron las variables de entorno de Supabase.");
}