// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Substitua os valores abaixo pela URL e pela Chave Anônima (Anon Key) do seu projeto no Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis de ambiente foram configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem ser configuradas no arquivo .env'
  );
}

// Você encontra esses valores nas configurações do seu projeto Supabase:
// Settings -> API -> Project URL & Project API Keys (use a anon public)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);