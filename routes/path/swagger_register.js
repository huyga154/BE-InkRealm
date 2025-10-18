// swagger_register.js
const cassoSwaggerRouter = require("./swagger/payment_swagger");
const novelSwaggerRouter = require("./swagger/novel_swagger")
const authSwaggerRouter = require("./swagger/auth_swagger")
const chapterSwaggerRouter = require("./swagger/chapter_swagger")

module.exports = (app) => {
    // Đăng ký tất cả các route Swagger riêng (nếu có thêm sau này)
    app.use("/payment", cassoSwaggerRouter);
    app.use("/novel", novelSwaggerRouter);
    app.use("/auth",authSwaggerRouter)
    app.use("/chapter",chapterSwaggerRouter)
};