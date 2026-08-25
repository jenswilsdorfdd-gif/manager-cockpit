import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sicherheits-Check, falls die Umgebungsvariablen nicht richtig geladen wurden
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Credentials fehlen! Bitte .env Datei prüfen.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);