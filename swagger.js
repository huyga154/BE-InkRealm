const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger config
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
                url: "http://localhost:3000/api", // khi chạy local
            },
        ],
    },
    apis: ["./routes/*.js"], // đọc docs trong routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
