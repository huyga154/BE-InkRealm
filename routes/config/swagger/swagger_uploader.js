// swagger_uploader.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "InkRealm API - Uploader",
            version: "1.0.0",
            description: "API dành cho người đăng truyện (Uploader)",
        },
        servers: [
            { url: "/uploader", description: "API chỉ dành cho uploader" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            {
                name: "Uploader",
                description: "API dành cho người đăng truyện",
            },
        ],
    },
    // chỉ quét các route uploader, ví dụ bạn để trong folder routes/uploader
    apis: ["./routes/path/swagger/uploader/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
