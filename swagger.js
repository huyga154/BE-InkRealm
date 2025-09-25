const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "InkRealm API",
            version: "1.0.0",
            description: "API cho web truyện chữ",
        },
        servers: [
            {
                url: process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}/api` // Vercel cần prefix /api
                    : "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/**/*.js"], // đọc docs trong folder routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
