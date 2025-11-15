import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { setCookie, getCookie } from 'hono/cookie';
import { getSupabase } from './lib/supabase.js';

import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import signUpPage from './views/pages/signup.js';
import membershipPage from './views/pages/memberships.js';
import contactPage from './views/pages/contact.js';
import loginPage from './views/pages/login.js';

const app = new Hono();

// Middleware: restore session from cookies
app.use('*', async (c, next) => {

  const supabase = getSupabase(c.env);
  const access = getCookie(c, 'sb-access-token');
  const refresh = getCookie(c, 'sb-refresh-token');

  if (access && refresh) {
    const { data } = await supabase.auth.setSession({
      access_token: access,
      refresh_token: refresh,
    });
    c.set('user', data?.user || null);
  }

  await next();
});

// Static files
app.use('/public/*', serveStatic({ root: './' }));

// Routes
app.get('/', (c) => {
  return c.html(layout('Home', homePage));
});

app.get('/signup', (c) => {
  return c.html(layout('SignUp', signUpPage));
});

app.get('/memberships', (c) => {
  return c.html(layout('Memberships', membershipPage));
});

app.get('/contact', (c) => {
  return c.html(layout('Contact Us', contactPage));
});

// Login page
app.get('/login', (c) => {
  return c.html(loginPage);
});

// Login POST handler
app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body.email;
  const password = body.password;
  const supabase = getSupabase(c.env);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.html(`<p>Login failed: ${error.message}</p>`);
  }

  setCookie(c, 'sb-access-token', data.session.access_token, { path: '/' });
  setCookie(c, 'sb-refresh-token', data.session.refresh_token, { path: '/' });

  return c.redirect('/');
});

// Email confirmation callback
app.get('/auth/callback', async (c) => {
  const token = c.req.query('token');
  const type = c.req.query('type');

  if (type === 'signup' && token) {
    const { data } = await supabase.auth.exchangeCodeForSession(token);

    if (data?.session) {
      setCookie(c, 'sb-access-token', data.session.access_token, { path: '/' });
      setCookie(c, 'sb-refresh-token', data.session.refresh_token, { path: '/' });
      return c.redirect('/');
    }
  }

  return c.redirect('/login');
});

// Export
export default app;
