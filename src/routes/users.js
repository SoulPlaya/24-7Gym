function handleError(error) {
  console.error("[Supabase Error]:", error);
  throw new Error(error?.message || "Unexpected authentication error");
}

/**
 * Create a new user (signup)
 *
 * NOTE: session will be null if email confirmation is enabled.
 * We use the "users" table to store profile data that isn't part of auth.
 * The users table is populated only after email is validated (avoiding webhooks).
 *
 * SQL used for the trigger that copies auth.users -> public.users:
 *
 * CREATE OR REPLACE FUNCTION public.handle_new_user()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   INSERT INTO public.users (id, email, full_name, phone, membership_active, membership_type)
 *   VALUES (
 *     NEW.id,
 *     NEW.email,
 *     NEW.raw_user_meta_data->>'full_name',
 *     NEW.raw_user_meta_data->>'phone',
 *     NEW.raw_user_meta_data->>'emergency_contact_number',
 *     COALESCE((NEW.raw_user_meta_data->>'membership_active')::boolean, false),
 *     NEW.raw_user_meta_data->>'membership_type'
 *   );
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_auth_user_created
 *   AFTER INSERT ON auth.users
 *   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
 */


/** 
 * Updating the Users table 
 * when a membership is bought it is essential to change if their account is active in the db
 * however for security we use a policy to allow only users to update their own membership status
 * 
 * CREATE POLICY "Users can read own data"
 * ON public.users FOR SELECT
 * USING (auth.uid() = id);

 * CREATE POLICY "Users can update own data"
 * ON public.users FOR UPDATE
 * USING (auth.uid() = id);
 */
 
export async function createNewUser(supabase, full_name, email, phone, password, emergency_contact_number) {
  if (!email || !password) throw new Error("Email and password required");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        phone,
        full_name,
        membership_active: false,
        membership_type: null,
        emergency_contact_number,
      },
      emailRedirectTo: `http://localhost:8787/auth/callback`,
    },
  });

  if (error) handleError(error);

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Login user (email + password)
 */
export async function loginUser(supabase, email, password) {
  if (!email || !password) throw new Error("Email and password required");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) handleError(error);

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Get user profile from "profiles" table
 */
export async function getUserProfile(supabase, userId) {
  if (!userId) throw new Error("User ID required");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) handleError(error);
  return data;
}

/**
 * Refresh session manually
 * WARNING:
 * Workers cannot use auto-refresh, so you MUST pass in tokens manually.
 */
export async function refreshSession(supabase, access_token, refresh_token) {
  if (!access_token || !refresh_token) {
    throw new Error("Access and refresh tokens required");
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) handleError(error);

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Logout user
 * NOTE: This ONLY invalidates the *server session* at Supabase.
 * You still must delete the cookies in your route handler.
 */
export async function logoutUser(supabase) {
  const { error } = await supabase.auth.signOut();
  if (error) handleError(error);
}

/**
 * Get the current user (requires session already set)
 */
export async function getCurrentUser(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error) handleError(error);
  return data.user;
}
/**
 * Update current user's membership status
 */
export async function updateMembership(supabase, membershipType, isActive) {
  // Get the current user's ID from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from("users")
    .update({
      membership_type: membershipType,
      membership_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();
  
  if (error) handleError(error);
  return data;
}