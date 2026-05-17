import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

// Simplified Proxy for better compatibility with chaining and awaiting
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : new Proxy({} as any, {
      get: (target, prop) => {
        if (prop === 'auth') {
          return new Proxy({} as any, {
            get: () => () => ({ data: { session: null, subscription: { unsubscribe: () => {} } }, error: null })
          });
        }
        
        // Mocking a chainable thenable
        const handler = () => {};
        const chainable = new Proxy(handler, {
          get: (t, p) => {
            if (p === 'then') {
              return (resolve: any) => resolve({ data: null, error: new Error('Supabase not configured') });
            }
            return chainable;
          },
          apply: () => chainable
        });
        return chainable;
      }
    });
