// swagger_register.js
const cassoSwaggerRouter = require("../../routes/path/payment/payment_swagger");
const novelRouter = require("../../routes/path/novel/novel_swagger")

module.exports = (app) => {
    // Đăng ký tất cả các route Swagger riêng (nếu có thêm sau này)
    app.use("/payment", cassoSwaggerRouter);
    app.use("/novel", novelRouter);
};