import { Hono } from "hono";
import { supabase } from "../lib/supabase";
import { setCookie } from "hono/cookie";
import loginPage from "../pages/loginPage";

export const auth = new Hono();

// GET /login
auth.get("/login", (c) => c.html(loginPage));

// POST /login
auth.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const email = body.email;
  const password = body.password;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return c.html(`Login failed: ${error.message}`);

  const session = data.session;

  setCookie(c, "sb-access-token", session.access_token, {
    httpOnly: true,
    path: "/",
  });

  setCookie(c, "sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    path: "/",
  });

  return c.redirect("/dashboard");
});

// Email callback
auth.get("/auth/callback", (c) => {
  return c.html(`
    <script type="module">
      import { createClient } from "https://esm.sh/@supabase/supabase-js";
      const supabase = createClient("${process.env.SUPABASE_URL}", "${process.env.SUPABASE_ANON_KEY}");

      const { data } = await supabase.auth.getSession();

      await fetch("/auth/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.session)
      });

      window.location.href = "/dashboard";
    </script>
  `);
});

// Save tokens after callback
auth.post("/auth/save", async (c) => {
  const session = await c.req.json();

  setCookie(c, "sb-access-token", session.access_token, { httpOnly: true, path: "/" });
  setCookie(c, "sb-refresh-token", session.refresh_token, { httpOnly: true, path: "/" });

  return c.json({ success: true });
});
