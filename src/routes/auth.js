import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { supabase } from "../lib/supabase";
import loginPage from "../pages/loginPage";

export const auth = new Hono();

// GET /login page
auth.get("/login", (c) => c.html(loginPage));

// POST /login (email + password)
auth.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const { email, password } = body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return c.html(`<p>Login failed: ${error?.message || "No session returned"}</p>`);
  }

  // Set httpOnly cookies
  setCookie(c, "sb-access-token", data.session.access_token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    // secure: true, // uncomment in production
  });
  setCookie(c, "sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    // secure: true, // uncomment in production
  });

  return c.redirect("/dashboard");
});

// OAuth / email callback
auth.get("/auth/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.redirect("/login");

  const { data, error } = await supabase.auth.exchangeCodeForSession({ code });
  if (error || !data?.session) return c.redirect("/login");

  // Set cookies server-side
  setCookie(c, "sb-access-token", data.session.access_token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
  });
  setCookie(c, "sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
  });

  return c.redirect("/")
});

// GET /auth/session — Hydrate client session
auth.get("/auth/session", async (c) => {
  const access = getCookie(c, "sb-access-token");
  const refresh = getCookie(c, "sb-refresh-token");

  if (!access || !refresh) return c.json({ session: null, user: null });

  const { data, error } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });

  if (error) return c.json({ session: null, user: null });

  return c.json({ session: data.session, user: data.user });
});
