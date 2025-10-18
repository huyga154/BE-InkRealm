// api_register.js
const indexRouter = require("../../routes/index");
const usersRouter = require("../../routes/users");
const testdbRouter = require("../../routes/path/test/testdb");
const novelRouter = require("../../routes/path/novel/novel_api");
const chapterRouter = require("../../routes/path/chapter/chapter_api");
const authRouter = require("../../routes/path/auth/auth_api");
const cassoRouter = require("../../routes/path/payment/payment_api");

module.exports = (app) => {
    // Đăng ký tất cả route tại đây
    app.use("/index", indexRouter);
    app.use("/users", usersRouter);
    app.use("/test", testdbRouter);
    app.use("/novel", novelRouter);
    app.use("/chapter", chapterRouter);
    app.use("/auth", authRouter);
    app.use("/payment", cassoRouter);
};
