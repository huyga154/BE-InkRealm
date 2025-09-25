const express = require("express");
const indexRouter = require("../routes/index");
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();

// Mount routes
app.use("/", indexRouter);

// Swagger UI tại /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export cho Vercel
module.exports = app;
