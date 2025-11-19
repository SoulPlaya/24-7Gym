function handleError(error) {
  console.error("[Supabase Error]:", error);
  throw new Error(error?.message || "Unexpected authentication error");
}

/**
 * Create a new user (signup)
 * NOTE: session will be null if email confirmation is enabled
 */
export async function createNewUser(supabase, email, password) {
  if (!email || !password) throw new Error("Email and password required");

  const { data, error } = await supabase.auth.signUp({
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
    .from("profiles")
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