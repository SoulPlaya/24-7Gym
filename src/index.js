import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { setCookie, getCookie } from 'hono/cookie';

import { getSupabase } from './lib/supabase.js';

import QRCode from 'qrcode';

import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import signUpPage from './views/pages/SignUp.js';
import membershipPage from './views/pages/memberships.js';
import contactPage from './views/pages/contact.js';
import loginPage from './views/pages/login.js';
import qrCodePage from './views/pages/qrCode.js';



//import user functions
import { createNewUser, loginUser, logoutUser } from './routes/users.js';

const app = new Hono();

// Restore session from cookies
app.use('*', async (c, next) => {
  const supabase = getSupabase(c.env);
  const access = getCookie(c, 'sb-access-token');
  const refresh = getCookie(c, 'sb-refresh-token');

  if (access && refresh) {
    const { data } = await supabase.auth.setSession({
      access_token: access,
      refresh_token: refresh,
    });

    const user = data?.user || null;
    c.set('user', user);

    console.log("SERVER: User on request:", user?.email ?? "Unauthenticated");
  } else {
    c.set('user', null);
    console.log("SERVER: No session cookies found — user is unauthenticated");
  }

  await next();
})

// Static files
app.use('/public/*', serveStatic({ root: './' }));

// Routes
app.get('/', (c) => {
  const user = c.get('user');
  return c.html(layout('Home', homePage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
});

app.get('/memberships', (c) => {
  return c.html(layout('Memberships', membershipPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/contact', (c) => {
  return c.html(layout('Contact Us', contactPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/login', async (c) => {
  return c.html(layout('Login', loginPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body.email;
  const password = body.password;

  const supabase = getSupabase(c.env);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return c.html(`<p>Login failed: ${error.message}</p>`);
  }

  const session = data.session;
  if (!session) {
    return c.html('<p>Login failed: no session returned</p>');
  }

  // Set secure httpOnly cookies so JS can't read them directly
  setCookie(c, 'sb-access-token', session.access_token, {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: true 
  });
  setCookie(c, 'sb-refresh-token', session.refresh_token, {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: true 
  });

  return c.redirect('/');
});

app.get('/signup', async (c) => {
  return c.html(layout('SignUp', signUpPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.post('/signup', async (c) => {
  const body = await c.req.parseBody();
  const full_name = body.name;
  const email = body.email;
  const phone = body.phone;
  const password = body.password;
  const emergency_contact_number = body.emergency_contact_number;
  

  const supabase = getSupabase(c.env);

  console.log(email, phone, password, emergency_contact_number);

  try {
    await createNewUser(supabase, full_name, email, phone, password, emergency_contact_number);
    return c.redirect('/login');
  } catch (error) {
    return c.html(`<p>Signup failed: ${error.message}</p>`);
  }
}
);

//QR Code page
app.get('/qr-code', async (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');

  console.log('QR USER:', user);
  console.log('USER ID:', user?.id);

  try {
    const svg = await QRCode.toString(user.id, { type: "svg" })

    return c.html(layout("My QR Code", qrCodePage(svg, user.id), c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
  } catch (error) {
    console.error('QR generation error:', error);
    return c.html(
      layout(
        'Error',
        '<p>Failed to generate QR code</p>',
        c.env.SUPABASE_URL,
        c.env.SUPABASE_ANON_KEY,
        user
      )
    );
  }
});



// Email confirmation callback 
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

// Hydrate user session on each request
app.get('/auth/session', async (c) => {
  const supabase = getSupabase(c.env);
  const access = getCookie(c, 'sb-access-token');
  const refresh = getCookie(c, 'sb-refresh-token');

  if (!access || !refresh) return c.json({ session: null });

  const { data } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });

  return c.json({ session: data?.session ?? null, user: data?.user ?? null });
});

// Export
export default app;
