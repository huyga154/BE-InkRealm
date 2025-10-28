// swagger_register.js
const cassoSwaggerRouter = require("./swagger/payment_swagger");
const novelSwaggerRouter = require("./swagger/novel_swagger")
const authSwaggerRouter = require("./swagger/auth_swagger")
const chapterSwaggerRouter = require("./swagger/chapter_swagger")
const chapterStatusSwaggerRouter = require("./swagger/chapter_status_swagger")
const adminSwaggerRouter = require("./swagger/admin_swagger")


module.exports = (app) => {
    // Đăng ký tất cả các route Swagger riêng (nếu có thêm sau này)
    app.use("/", cassoSwaggerRouter);
    app.use("/", novelSwaggerRouter);
    app.use("/",authSwaggerRouter);
    app.use("/",chapterSwaggerRouter);
    app.use("/",chapterStatusSwaggerRouter);
    app.use("/",adminSwaggerRouter);
};