const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Gửi email
 * @param {string} to - Email người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} text - Nội dung email
 */
async function sendMail(to, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // App Password
            }
        });

        const mailOptions = {
            from: `"InkRealm" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (err) {
        console.error("Send mail error:", err);
        throw err;
    }
}

module.exports = sendMail;
