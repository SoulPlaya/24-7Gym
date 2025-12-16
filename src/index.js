import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { setCookie, getCookie } from 'hono/cookie';

import { getSupabase, getSupabaseAdmin } from './lib/supabase.js';
import { requireAuth, requireRole, attachUserRole } from './middleware/auth.js';

import QRCode from 'qrcode';

// Import regular views
import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import signUpPage from './views/pages/SignUp.js';
import membershipPage from './views/pages/memberships.js';
import contactPage from './views/pages/contact.js';
import loginPage from './views/pages/login.js';
import qrCodePage from './views/pages/qrCode.js';

// Import management views
import managementDashboard from './views/pages/managementDashboard.js';
import userDetailPage from './views/pages/userDetail.js';

// Import management functions
import { 
  getAllUsers, 
  createUserAsAdmin, 
  updateUserRole, 
  deleteUser,
  getUserById 
} from './routes/management.js';

// Import user functions
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
  } else {
    c.set('user', null);
  }

  await next();
});

// Attach user role to context
app.use('*', attachUserRole);

// Static files
app.use('/public/*', serveStatic({ root: './' }));

// ========== PUBLIC ROUTES ==========

app.get('/', (c) => {
  const user = c.get('user');
  return c.html(layout('Home', homePage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
});

app.get('/memberships', (c) => {
  const user = c.get('user');
  return c.html(layout('Memberships', membershipPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
});

app.get('/contact', (c) => {
  const user = c.get('user');
  return c.html(layout('Contact Us', contactPage, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
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

  try {
    await createNewUser(supabase, full_name, email, phone, password, emergency_contact_number);
    return c.redirect('/login');
  } catch (error) {
    return c.html(`<p>Signup failed: ${error.message}</p>`);
  }
});

// ========== AUTHENTICATED ROUTES ==========

app.get('/qr-code', requireAuth, async (c) => {
  const user = c.get('user');

  try {
    const svg = await QRCode.toString(user.id, { type: "svg" });
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

// ========== MANAGEMENT ROUTES (Admin/Coach) ==========

// Dashboard - view all users
app.get('/management/dashboard', requireRole('admin', 'coach'), async (c) => {
  const user = c.get('user');
  const userRole = c.get('userRole');
  const access = getCookie(c, 'sb-access-token');
  const supabase = getSupabase(c.env, access);

  try {
    const users = await getAllUsers(supabase);
    const dashboardContent = managementDashboard(users, userRole);
    
    return c.html(layout('Dashboard', dashboardContent, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
  } catch (error) {
    return c.html(`<p>Error loading dashboard: ${error.message}</p>`);
  }
});

// Create new user form
app.get('/management/users/new', requireRole('admin'), async (c) => {
  const user = c.get('user');
  
  return c.html(layout('Create User', createUserPage(), c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
});

// Create user handler
app.post('/management/users/create', requireRole('admin'), async (c) => {
  const body = await c.req.parseBody();
  const supabaseAdmin = getSupabaseAdmin(c.env);

  try {
    await createUserAsAdmin(supabaseAdmin, {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: body.role,
      emergency_contact_number: body.emergency_contact_number
    });
    
    return c.redirect('/management/dashboard');
  } catch (error) {
    return c.html(`<p>Error creating user: ${error.message}</p>`);
  }
});

// View user details
app.get('/management/users/:id', requireRole('admin', 'coach'), async (c) => {
  const userId = c.req.param('id');
  const user = c.get('user');
  const userRole = c.get('userRole');
  const access = getCookie(c, 'sb-access-token');
  const supabase = getSupabase(c.env, access);

  try {
    const targetUser = await getUserById(supabase, userId);
    const qrCode = await QRCode.toString(userId, { type: "svg" });
    
    const detailContent = userDetailPage(targetUser, qrCode, userRole);
    
    return c.html(layout(`User: ${targetUser.full_name}`, detailContent, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, user));
  } catch (error) {
    return c.html(`<p>Error loading user: ${error.message}</p>`);
  }
});

// Update user role
app.post('/management/users/:id/role', requireRole('admin'), async (c) => {
  const userId = c.req.param('id');
  const body = await c.req.parseBody();
  const newRole = body.role;
  
  const access = getCookie(c, 'sb-access-token');
  const supabase = getSupabase(c.env, access);

  try {
    await updateUserRole(supabase, userId, newRole);
    return c.redirect(`/management/users/${userId}`);
  } catch (error) {
    return c.html(`<p>Error updating role: ${error.message}</p>`);
  }
});

// Delete user
app.post('/management/users/:id/delete', requireRole('admin'), async (c) => {
  const userId = c.req.param('id');
  const supabaseAdmin = getSupabaseAdmin(c.env);

  try {
    await deleteUser(supabaseAdmin, userId);
    return c.redirect('/management/dashboard');
  } catch (error) {
    return c.html(`<p>Error deleting user: ${error.message}</p>`);
  }
});

// ========== AUTH CALLBACKS ==========

app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  const supabase = getSupabase(c.env);

  if (!code) return c.redirect('/login');

  const { data, error } = await supabase.auth.exchangeCodeForSession({ code });

  if (error) {
    console.error(error);
    return c.redirect('/login');
  }

  if (data?.session) {
    setCookie(c, 'sb-access-token', data.session.access_token, { 
      httpOnly: true, 
      path: '/', 
      sameSite: 'Lax',
      secure: true 
    });
    setCookie(c, 'sb-refresh-token', data.session.refresh_token, { 
      httpOnly: true, 
      path: '/', 
      sameSite: 'Lax',
      secure: true 
    });
    return c.redirect('/');
  }

  return c.redirect('/login');
});

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

export default app;