// api_register.js
const indexRouter = require("../../index");
const usersRouter = require("../../users");
const testdbRouter = require("./user/testdb");
const novelRouter = require("./user/novel_api");
const chapterRouter = require("./user/chapter_api");
const authRouter = require("./user/auth_api");
const cassoRouter = require("./user/payment_api");

module.exports = (app) => {
    // Đăng ký tất cả route tại đây
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/test", testdbRouter);
    app.use("/novel", novelRouter);
    app.use("/chapter", chapterRouter);
    app.use("/auth", authRouter);
    app.use("/payment", cassoRouter);
};
