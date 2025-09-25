const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');

// Import routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testdbRouter = require('./routes/test/testdb');
const storyRouter = require('./routes/novel/novel_api');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/index', indexRouter);   // /api/index
app.use('/users', usersRouter);   // /api/users
app.use('/test', testdbRouter);   // /api/test
app.use('/novel', storyRouter);   // /api/novel

// Swagger UI làm index mặc định
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }'
}));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found :3" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message + "-aaaa" });
});

// Export cho Vercel
module.exports = app;
