const express = require("express");
const crypto = require("crypto");
const db = require("../../../db"); // DB Postgres hoặc MySQL
require("dotenv").config();

const router = express.Router();

/**
 * @swagger
 * /payment/casso/webhook:
 *   post:
 *     summary: Webhook nhận thông tin giao dịch từ Casso
 *     description: |
 *       Casso sẽ gọi endpoint này khi có giao dịch nạp/rút tiền.
 *       Hệ thống xác thực chữ ký (signature), cộng coin cho tài khoản và ghi lịch sử giao dịch.
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 example:
 *                   transactions:
 *                     - accountNumber: "123456"
 *                       amount: 2000
 *                       description: "Nạp coin"
 *               signature:
 *                 type: string
 *                 example: "abcdef123456..."
 *     responses:
 *       200:
 *         description: Webhook xử lý thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 *       400:
 *         description: Dữ liệu hoặc chữ ký không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */

router.post("/casso/webhook", async (req, res) => {
    try {
        const { data, signature } = req.body;
        if (!data || !signature)
            return res.status(400).json({ error: "Thiếu data hoặc signature" });

        // 1️⃣ Chuẩn hóa dữ liệu thành string để tạo HMAC
        const rawData = JSON.stringify(data);

        // 2️⃣ Tạo HMAC SHA256 với key trong env
        const computedSignature = crypto
            .createHmac("sha256", process.env.CASSO_FLOW_CHECKSUM_KEY)
            .update(rawData)
            .digest("hex");

        if (computedSignature !== signature)
            return res.status(400).json({ error: "Sai signature, có thể giả mạo" });

        // 3️⃣ Xử lý từng giao dịch
        const transactions = data.transactions || [];
        for (const tx of transactions) {
            const amount = Number(tx.amount || 0);
            const description = tx.description || "Giao dịch từ Casso";
            const accountId = process.env.TARGET_ACCOUNT_ID || 1; // có thể map từ tx.accountNumber

            await db.query(
                `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
                [amount, accountId]
            );

            await db.query(
                `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
         VALUES ($1, NOW(), $2, $3)`,
                [accountId, description, amount]
            );

            console.log(`✅ Cộng ${amount} coin cho accountId = ${accountId}`);
        }

        res.json({ message: "OK" });
    } catch (err) {
        console.error("🔥 Lỗi webhook Casso:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
