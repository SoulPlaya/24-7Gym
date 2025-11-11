const Router = require('@koa/router');
const homePage = require('../views/pages/home');
const aboutPage = require('../views/pages/about');
const classesPage = require('../views/pages/classes');
const contactPage = require('../views/pages/contact');
const layout = require('../views/layout');

const router = new Router();

router.get('/', (ctx) => {
    ctx.type = 'html';
    ctx.body = layout('Home', homePage);
});

router.get('/about', (ctx) => {
    ctx.type = 'html';
    ctx.body = layout('About Us', aboutPage);
});

router.get('/classes', (ctx) => {
    ctx.type = 'html';
    ctx.body = layout('Classes', classesPage);
});

router.get('/contact', (ctx) => {
    ctx.type = 'html';
    ctx.body = layout('Contact Us', contactPage);
});

router.post('/contact', (ctx) => {
    ctx.type = 'html';
    const thankYouPage = `
        <div class="hero">
            <h1>Thank You!</h1>
            <p>We've received your message and will get back to you soon.</p>
            <a href="/" class="btn">Back to Home</a>
        </div>
    `;
    ctx.body = layout('Thank You', thankYouPage);
});

module.exports = router;