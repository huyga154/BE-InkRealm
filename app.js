const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const { swaggerUi, swaggerSpec } = require("./swagger");

const registerAPIs = require("./routes/config/api_register");
const registerSwagger = require("./routes/config/swagger_register")

const corsMiddleware = require("./routes/config/corsConfig");

const app = express();

app.use(corsMiddleware);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

registerAPIs(app);
registerSwagger(app);

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
