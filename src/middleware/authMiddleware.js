import { getCookie } from "hono/cookie";
import { getSupabase } from "../lib/supabase";

export const authMiddleware = async (c, next) => {
  const access_token = getCookie(c, "sb-access-token");
  const refresh_token = getCookie(c, "sb-refresh-token");

  
  const supabase = getSupabase(c.env);

  if (!refresh_token) {
    c.set("user", null);
    return next();
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    c.set("user", null);
  } else {
    c.set("user", data.session.user);
  }

  return next();
};
