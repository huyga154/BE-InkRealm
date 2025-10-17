const express = require("express");
const crypto = require("crypto");
const db = require("../../../db");
const payos = require("../../utils/payos");
require("dotenv").config();

const router = express.Router();


/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Webhook nhận thông tin thanh toán từ PayOS - Ver 1.2
 *     description: |
 *       PayOS sẽ gọi endpoint này khi người dùng thanh toán thành công.
 *       Hệ thống xác thực chữ ký (signature), sau đó cộng coin cho tài khoản đích và ghi lịch sử giao dịch.
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "00"
 *               desc:
 *                 type: string
 *                 example: "success"
 *               success:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   orderCode:
 *                     type: number
 *                     example: 123
 *                   amount:
 *                     type: number
 *                     example: 3000
 *                   description:
 *                     type: string
 *                     example: "VQRIO123"
 *                   transactionDateTime:
 *                     type: string
 *                     example: "2023-02-04 18:25:00"
 *               signature:
 *                 type: string
 *                 example: "412e915d2871504ed31be63c8f62a149..."
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
router.post("/webhook", async (req, res) => {
    try {
        console.log("📩 Nhận webhook từ PayOS:", JSON.stringify(req.body, null, 2));

        const { data, signature } = req.body;
        if (!data || !signature)
            return res.status(400).json({ error: "Thiếu data hoặc signature" });

        // Hàm sắp xếp key trong object
        const sortObjDataByKey = (object) =>
            Object.keys(object)
                .sort()
                .reduce((obj, key) => {
                    obj[key] = object[key];
                    return obj;
                }, {});

        // Hàm chuyển object thành chuỗi query string
        const convertObjToQueryStr = (object) =>
            Object.keys(object)
                .filter((key) => object[key] !== undefined)
                .map((key) => {
                    let value = object[key];
                    if (value && Array.isArray(value)) {
                        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
                    }
                    if ([null, undefined, "undefined", "null"].includes(value)) {
                        value = "";
                    }
                    return `${key}=${value}`;
                })
                .join("&");

        // Xác thực chữ ký (HMAC SHA256)
        const sortedDataByKey = sortObjDataByKey(data);
        const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
        const computedSignature = crypto
            .createHmac("sha256", process.env.CASSO_CHECKSUM_KEY)
            .update(dataQueryStr)
            .digest("hex");

        if (computedSignature !== signature)
            return res.status(400).json({ error: "Sai signature, có thể giả mạo" });

        // ✅ Nếu hợp lệ thì xử lý giao dịch
        const amount = Number(data.amount || 0);
        const description = data.description;

        const match = description.match(/uid(\d+)\s+(\d+)/i);
        if (!match) {
            console.warn("⚠️ Không tìm thấy userId trong description:", description);
            return res.status(400).json({ error: description });
        }

        const userId = Number(match[1]);
        const coinToAdd = Number(match[2]);

        if (isNaN(userId) || isNaN(coinToAdd)) {
            return res.status(400).json({ error: "Sai format description" });
        }

        // ===== 4️⃣ Cộng tiền và ghi log =====
        await db.query(
            `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
            [coinToAdd, userId]
        );

        await db.query(
            `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
       VALUES ($1, NOW(), $2, $3)`,
            [userId, description, "+" + coinToAdd]
        );

       //  await db.query(
       //      `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
       //      [amount, userId]
       //  );
       //
       //  await db.query(
       //      `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
       // VALUES ($1, NOW(), $2, $3)`,
       //      [userId, description, amount]
       //  );

       //  const accountId = process.env.TARGET_ACCOUNT_ID || 1; // Tài khoản mặc định để cộng coin
       //
       //  await db.query(
       //      `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
       //      [amount, accountId]
       //  );
       //
       //  await db.query(
       //      `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
       // VALUES ($1, NOW(), $2, $3)`,
       //      [accountId, description, amount]
       //  );

        console.log(`✅ Cộng ${amount} coin cho accountId = ${accountId}`);
        res.json({ message: "OK" });
    } catch (err) {
        console.error("🔥 Lỗi webhook:", err);
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /payment/create-payment-link:
 *   post:
 *     summary: Tạo link thanh toán bằng PayOS (SDK mới)
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2000
 *               description:
 *                 type: string
 *                 example: "uid1 2200"
 *               returnUrl:
 *                 type: string
 *                 example: "https://www.youtube.com/"
 *               cancelUrl:
 *                 type: string
 *                 example: "https://www.google.com/"
 *     responses:
 *       200:
 *         description: Tạo thành công link thanh toán
 */
router.post("/create-payment-link", async (req, res) => {
    try {
        const orderCode = Number(String(Date.now()).slice(-6)); // random 6 số

        const paymentLink = await payos.paymentRequests.create({
            orderCode,
            amount: req.body.amount,
            description: req.body.description,
            returnUrl: req.body.returnUrl,
            cancelUrl: req.body.cancelUrl,
        });

        console.log("✅ Payment link created:", paymentLink.checkoutUrl);

        res.json({
            success: true,
            message: "Tạo link thanh toán thành công",
            orderCode,
            checkoutUrl: paymentLink.checkoutUrl,
            data: paymentLink,
        });
    } catch (error) {
        console.error("❌ Lỗi tạo link thanh toán:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi khi tạo link thanh toán",
        });
    }
});

module.exports = router;
