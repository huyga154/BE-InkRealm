// api_register.js
const indexRouter = require("../../index");
const testdbRouter = require("./user/testdb");
const novelRouter = require("./user/novel_api");
const chapterRouter = require("./user/chapter_api");
const authRouter = require("./user/auth_api");
const cassoRouter = require("./user/payment_api");

module.exports = (app) => {
    // Đăng ký tất cả route tại đây
    app.use("/", indexRouter);
    app.use("/", testdbRouter);
    app.use("/", novelRouter);
    app.use("/chapter", chapterRouter);
    app.use("/auth", authRouter);
    app.use("/payment", cassoRouter);
};
