import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("¡Cuidado! Faltan las llaves de Supabase en el archivo .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseKey)