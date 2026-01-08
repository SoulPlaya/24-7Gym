import { getCookie } from "hono/cookie";
import { getSupabase, getSupabaseAdmin, hasRole } from "../lib/supabase";

// Require authentication
export const requireAuth = async (c, next) => {
  const user = c.get('user');
  
  if (!user) {
    return c.redirect('/login');
  }
  
  await next();
};

export const requireRole = (...allowed) => async (c, next) => {
  const user = c.get('user');

  if (!user) {
    return c.text('Unauthorized', 401);
  }

  const supabase = getSupabaseAdmin(c.env);

  const { data, error } = await supabase
    .from('users') 
    .select('role')
    .eq('id', user.id)
    .single();

  console.log("User role check:", data);
  if (error || !data || !allowed.includes(data.role)) {
    return c.text('Forbidden', 403);
  }

  // Attach role for downstream handlers
  c.set('userRole', data.role);

  await next();
};


//Get user's role and attach to context
export const attachUserRole = async (c, next) => {
  const user = c.get('user');
  
  if (user) {
    const access = getCookie(c, 'sb-access-token');
    const supabase = getSupabase(c.env, access);
    
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    c.set('userRole', data?.role || 'member');
  }
  
  await next();
};