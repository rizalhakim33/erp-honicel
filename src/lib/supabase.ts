import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use a proxy or a placeholder to avoid crashing on module load
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'auth') {
          return new Proxy({} as any, {
            get: () => () => ({ data: { session: null, subscription: { unsubscribe: () => {} } }, error: null })
          });
        }
        return () => {
          console.warn('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
          return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
        };
      }
    });
