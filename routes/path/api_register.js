// api_register.js
const indexRouter = require("../index");
const usersRouter = require("../users");
const testdbRouter = require("./api/testdb");
const novelRouter = require("./api/novel_api");
const chapterRouter = require("./api/chapter_api");
const authRouter = require("./api/auth_api");
const cassoRouter = require("./api/payment_api");

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
