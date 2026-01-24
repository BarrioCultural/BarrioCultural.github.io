// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Aviso: Variables de Supabase no detectadas en este entorno.");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);