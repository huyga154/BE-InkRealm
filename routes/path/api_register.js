// api_register.js
const indexRouter = require("../index");
const testdbRouter = require("./api/test");
const novelRouter = require("./api/novel_api");
const chapterRouter = require("./api/chapter_api");
const authRouter = require("./api/auth_api");
const cassoRouter = require("./api/payment_api");
const chapterStatusRouter = require("./api/chapter_status_api");

module.exports = (app) => {
    // Đăng ký tất cả route tại đây
    app.use("/", indexRouter);
    app.use("/", testdbRouter);
    app.use("/", novelRouter);
    app.use("/", chapterRouter);
    app.use("/auth", authRouter);
    app.use("/payment", cassoRouter);
    app.use("/",chapterStatusRouter)
};
