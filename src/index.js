import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';


import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import aboutPage from './views/pages/about.js';
import membershipPage from './views/pages/memberships.js';
import contactPage from './views/pages/contact.js';
import loginPage from './views/pages/login.js';

const app = new Hono();

// Serve static files from public directory
app.use('/public/*', serveStatic({ root: './' }));

// Home page
app.get('/', (c) => {
  return c.html(layout('Home', homePage));
});

// About page
app.get('/about', (c) => {
  return c.html(layout('About Us', aboutPage));
});

// Membership page
app.get('/memberships', (c) => {
  return c.html(layout('Memberships', membershipPage));
});

// Contact page (GET)
app.get('/contact', (c) => {
  return c.html(layout('Contact Us', contactPage));
});

// Login page 
app.get('/login', (c) => {
  return c.html(loginPage);
});

// Export for Cloudflare Workers
export default app;