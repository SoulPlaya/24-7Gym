const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');

const app = new Koa();

// Add body parser for POST requests
app.use(bodyParser());

// Use routes
app.use(router.routes());
app.use(router.allowedMethods());

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app.callback();