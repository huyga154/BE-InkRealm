// swagger_register.js
const cassoSwaggerRouter = require("./user/payment_swagger");
const novelSwaggerRouter = require("./user/novel_swagger")
const authSwaggerRouter = require("./user/auth_swagger")
const chapterSwaggerRouter = require("./user/chapter_swagger")

module.exports = (app) => {
    // Đăng ký tất cả các route Swagger riêng (nếu có thêm sau này)
    app.use("/payment", cassoSwaggerRouter);
    app.use("/novel", novelSwaggerRouter);
    app.use("/auth",authSwaggerRouter)
    app.use("/chapter",chapterSwaggerRouter)
};