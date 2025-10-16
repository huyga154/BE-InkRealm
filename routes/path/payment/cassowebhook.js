const express = require("express");
const crypto = require("crypto");
const db = require("../../../db");
require("dotenv").config();

const router = express.Router();

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Webhook nhận giao dịch từ Casso - Không dùng swagger để test
 *     description: |
 *       Casso sẽ gọi endpoint này khi có giao dịch mới.
 *       API xác thực checksum, sau đó cộng coin cho tài khoản đích và lưu lịch sử giao dịch.
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
 *                 properties:
 *                   transactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                           example: 10000
 *                         description:
 *                           type: string
 *                           example: "Nap coin 10000 tu Casso"
 *               checksum:
 *                 type: string
 *                 example: "f8b4f51784e4b9c1f336537c95e995d7..."
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
 *         description: Dữ liệu hoặc checksum sai
 *       500:
 *         description: Lỗi hệ thống
 */

router.post("/webhook", async (req, res) => {
    try {
        console.log("📩 Nhận webhook từ Casso:", JSON.stringify(req.body, null, 2));

        const { data, checksum } = req.body;
        if (!data || !checksum)
            return res.status(400).json({ error: "Thiếu data hoặc checksum" });

        const rawData = JSON.stringify(data);
        const computedChecksum = crypto
            .createHash("sha256")
            .update(rawData + process.env.CASSO_CHECKSUM_KEY)
            .digest("hex");

        if (computedChecksum !== checksum)
            return res.status(400).json({ error: "Sai checksum, có thể giả mạo" });

        const transactions = data.transactions;
        if (!transactions || !Array.isArray(transactions))
            return res.status(400).json({ error: "Không có giao dịch hợp lệ" });

        for (const tx of transactions) {
            const amount = Number(tx.amount || 0);
            const description = tx.description || "Nạp coin từ Casso";

            await db.query(
                `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
                [amount, process.env.TARGET_ACCOUNT_ID]
            );

            await db.query(
                `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
                 VALUES ($1, NOW(), $2, $3)`,
                [process.env.TARGET_ACCOUNT_ID, description, amount]
            );

            console.log(`✅ Cộng ${amount} coin cho accountId = ${process.env.TARGET_ACCOUNT_ID}`);
        }

        res.json({ message: "OK" });
    } catch (err) {
        console.error("🔥 Lỗi webhook:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
