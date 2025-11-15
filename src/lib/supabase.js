import { createClient } from '@supabase/supabase-js';

//Returns a new Supabase client for each request.
export const getSupabase = (env) => {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,   // Workers cannot store tokens in memory
        persistSession: false,     // Workers cannot use localStorage
        detectSessionInUrl: false,
      },
    }
  );
};
