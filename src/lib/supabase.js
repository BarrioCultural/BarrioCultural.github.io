import { createClient } from '@supabase/supabase-js';

// Intentamos capturar las variables reales
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Solo usamos el 'placeholder' como último recurso si AMBAS fallan
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Esto nos ayudará a ver en la consola del navegador si las llaves cargaron
if (typeof window !== "undefined") {
  if (!supabaseUrl) console.error("❌ Error: La URL de Supabase no está llegando al navegador.");
}