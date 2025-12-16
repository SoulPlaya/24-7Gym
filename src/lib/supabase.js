import { createClient } from '@supabase/supabase-js';

// Get Supabase client with user context
export const getSupabase = (env, accessToken = null) => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing.');
  }
  
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      debug: true
    },
  };

  // If we have an access token, include it for user-specific operations
  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  }
  
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    options
  );
};

// Get admin client (use service role key for admin operations)
export const getSupabaseAdmin = (env) => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase admin credentials are missing.');
  }
  
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Helper to check if user has required role
export const hasRole = async (supabase, userId, requiredRoles) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(data.role);
};