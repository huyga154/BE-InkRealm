var express = require('express');
var router = express.Router();
const pool = require("../../../db");

require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Test-API
 *   description: API dùng để test
 */


/**
 * @swagger
 * /test/test-db:
 *   post:
 *     summary: Test kết nối DB
 *     tags: [Test-API]
 *     responses:
 *       200:
 *         description: Thời gian hiện tại của DB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 time:
 *                   type: object
 */

/* ✅ API test DB */
router.post('/test-db', async function(req, res) {
    try {
        console.log("---API--- Test DB");
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        console.error("DB Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /test/send-mail:
 *   post:
 *     summary: Gửi email test
 *     tags: [Test-API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Email người nhận
 *                 example: "vonhantinh01@gmail.com"
 *               subject:
 *                 type: string
 *                 description: Tiêu đề email
 *                 example: "Hello Test"
 *               text:
 *                 type: string
 *                 description: Nội dung email
 *                 example: "Nếu bạn nhận được email này thì cấu hình Gmail App Password OK!"
 *     responses:
 *       200:
 *         description: Email gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 info:
 *                   type: string
 *       400:
 *         description: Thiếu email người nhận
 *       500:
 *         description: Lỗi server khi gửi email
 */
router.post("/send-mail", async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to) return res.status(400).json({ error: "Recipient email is required" });

    const mailSubject = subject || "Test Gmail App Password";
    const mailText = text || "Nếu bạn nhận được email này thì cấu hình Gmail App Password đã OK ✅";

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // nhớ bỏ khoảng trắng như đã nói
            },
        });

        const info = await transporter.sendMail({
            from: `"Test Mail" <${process.env.EMAIL_USER}>`,
            to,
            subject: mailSubject,
            text: mailText,
        });

        res.json({ success: true, message: "Email sent", info: info.response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email", details: err.message });
    }
});

/**
 * @swagger
 * /test/decode-token:
 *   post:
 *     summary: Giải mã JWT token
 *     tags: [Test-API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token cần giải mã
 *     responses:
 *       200:
 *         description: Payload giải mã token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payload:
 *                   type: object
 *                   example: { id: 1, username: "huy123", iat: 1690000000 }
 *       400:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 */
router.post("/decode-token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ payload });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Invalid token" });
    }
});

module.exports = router;