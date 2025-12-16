import { getCookie } from 'hono/cookie';
import { getSupabase, getSupabaseAdmin } from '../lib/supabase.js';

// Get all users (for admin/coach dashboard)
export const getAllUsers = async (supabase) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, phone, role, created_at')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Create user as admin (bypasses email confirmation)
export const createUserAsAdmin = async (supabaseAdmin, userData) => {
  const { full_name, email, phone, password, role = 'member', emergency_contact_number } = userData;
  
  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name,
      phone,
      emergency_contact_number
    }
  });
  
  if (authError) throw authError;
  
  // Create user record
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: authData.user.id,
      full_name,
      email,
      phone,
      role,
      emergency_contact_number
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update user role
export const updateUserRole = async (supabase, userId, newRole) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete user
export const deleteUser = async (supabaseAdmin, userId) => {
  // Delete from users table (this should cascade if set up)
  const { error: dbError } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (dbError) throw dbError;
  
  // Delete auth user
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  
  if (authError) throw authError;
  return true;
};

// Get user details
export const getUserById = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};