const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const router = require('./routes');

const app = new Koa();

// Serve static files (CSS, images, etc.)
app.use(serve(path.join(__dirname, 'public')));

// Use routes
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
})