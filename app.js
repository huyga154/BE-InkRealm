const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const { swaggerUi, swaggerSpec } = require("./swagger");

// Import routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const testdbRouter = require("./routes/path/test/testdb");
const novelRouter = require("./routes/path/novel/novel_api");
const chapterRouter = require("./routes/path/chapter/chapter_api")
const authRouter = require("./routes/path/auth/auth_api");
const cassoRouter = require("./routes/path/payment/payment_api");
// const cassoSwaggerRouter = require("./routes/path/payment/payment_swagger");

const corsMiddleware = require("./routes/config/corsConfig");

const app = express();

app.use(corsMiddleware);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/index", indexRouter);
app.use("/users", usersRouter);
app.use("/test", testdbRouter);
app.use("/novel", novelRouter);
app.use("/chapter", chapterRouter)
app.use("/auth", authRouter);
app.use("/payment", cassoRouter);
// app.use("/payment", cassoSwaggerRouter);

// Swagger UI (truy cập ở /api/api-docs trên Vercel, /api-docs khi local)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
    })
);

// JSON spec để debug
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: err.message });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
