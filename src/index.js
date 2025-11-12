import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';


import layout from './views/layout.js';
import homePage from './views/pages/home.js';
import aboutPage from './views/pages/about.js';
import classesPage from './views/pages/classes.js';
import pricingPage from './views/pages/contact.js';
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

// Classes page
app.get('/classes', (c) => {
  return c.html(layout('Classes', classesPage));
});

// Contact page (GET)
app.get('/contact', (c) => {
  return c.html(layout('Contact Us', pricingPage));
});

// Login page 
app.get('/login', (c) => {
  return c.html(layout('login', loginPage));
});

// Export for Cloudflare Workers
export default app;