// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var testdbRouter = require('./routes/test/testdb');
// var storyRouter = require('./routes/novel/novel_api')
// var setupSwagger = require("./swagger");
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// // mount routers
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/test', testdbRouter);
// app.use('/novel',storyRouter);
//
// setupSwagger(app);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     res.status(err.status || 500);
//     res.render('error');
// });
//
// module.exports = app;


const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSetup = require('./swagger');

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

// API routes
app.use('/users', usersRouter);
app.use('/test', testdbRouter);
app.use('/novel', storyRouter);

// Swagger UI làm index mặc định
app.use('/', swaggerUi.serve, swaggerSetup);

// 404 handler (nếu muốn)
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

// Export app cho Vercel
module.exports = app;

