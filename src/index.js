import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { setCookie, getCookie } from 'hono/cookie';
import { getSupabase } from './lib/supabase.js';

import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import signUpPage from './views/pages/SignUp.js';
import membershipPage from './views/pages/memberships.js';
import contactPage from './views/pages/contact.js';
import loginPage from './views/pages/login.js';
//import qrcodepage from './views/pages/qrCode.js';



//import user functions
import { createNewUser, loginUser, logoutUser } from './routes/users.js';

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

app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body.email;
  const password = body.password;

  const supabase = getSupabase(c.env);

  try {
    const { user, session } = await loginUser(supabase, email, password);

    // Save tokens in cookies
    setCookie(c, 'sb-access-token', session.access_token, { path: '/' });
    setCookie(c, 'sb-refresh-token', session.refresh_token, { path: '/' });

    return c.redirect('/');
  } catch (error) {
    return c.html(`<p>Login failed: ${error.message}</p>`);
  }
});

app.post('/signup', async (c) => {
  const body = await c.req.parseBody();
  const email = body.email;
  const password = body.password;
  

  const supabase = getSupabase(c.env);

  try {
    await createNewUser(supabase, email, password);
    return c.html('<p>Signup successful! Please check your email to confirm your account.</p>');
  } catch (error) {
    return c.html(`<p>Signup failed: ${error.message}</p>`);
  }
}
);

// Email confirmation callback 
// Need to test this to make sure it works as expected in the dark till then.
app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  const type = c.req.query('type');

  const supabase = getSupabase(c.env);

  if (!code) return c.redirect('/login');

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession({
    code,
  });

  if (error) {
    console.error(error);
    return c.redirect('/login');
  }

  if (data?.session) {
    setCookie(c, 'sb-access-token', data.session.access_token, { path: '/' });
    setCookie(c, 'sb-refresh-token', data.session.refresh_token, { path: '/' });
    return c.redirect('/');
  }

  return c.redirect('/login');
});

// Export
export default app;
