import { createClient } from '@supabase/supabase-js';
let client = null;

export const getSupabase = (env) => {

  //Returns a new Supabase client for each request.
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing.');
  }
  
  if (client) return client;

  client = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );

  return client;
};
