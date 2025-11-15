import { supabase } from "../lib/supabase";

function handleError(error) {
  console.error("[Supabase Error]:", error);
  throw new Error(error?.message || "Unexpected authentication error");
}

export async function createNewUser(email, password) {
  if (!email || !password) throw new Error("Email and password required");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) handleError(error);

  return {
    user: data.user,
    session: data.session, // might be null if email confirmation is on
  };
}

export async function loginUser(email, password) {
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

export async function getUserProfile(userId) {
  if (!userId) throw new Error("User ID required");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) handleError(error);
  return data;
}

export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) handleError(error);

  return {
    user: data.user,
    session: data.session,
  };
}
