const express = require("express");
const crypto = require("crypto");
const db = require("../../../db"); // import db của bạn
require("dotenv").config();
const sendResponseWithLog = require("../../utils/logResponse");

const router = express.Router();

function sortObjDataByKey(data) {
    const sortedObj = {};
    Object.keys(data).sort().forEach((key) => {
        if (data[key] && typeof data[key] === "object" && !Array.isArray(data[key])) {
            sortedObj[key] = sortObjDataByKey(data[key]);
        } else {
            sortedObj[key] = data[key];
        }
    });
    return sortedObj;
}

function verifyWebhookSignature(headers, data, checksumKey) {
    const receivedSignature = headers["x-casso-signature"];
    if (!receivedSignature) return false;

    const match = receivedSignature.match(/t=(\d+),v1=([a-f0-9]+)/);
    if (!match) return false;

    const timestamp = match[1];
    const signature = match[2];

    const sortedData = sortObjDataByKey(data);
    const messageToSign = `${timestamp}.${JSON.stringify(sortedData)}`;

    const generatedSignature = crypto
        .createHmac("sha512", checksumKey)
        .update(messageToSign)
        .digest("hex");

    return signature === generatedSignature;
}

/**
 * @swagger
 * /payment/casso/webhook:
 *   post:
 *     summary: Nhận webhook từ Casso khi có giao dịch
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: number
 *                 example: 0
 *               data:
 *                 type: object
 *                 example:
 *                   id: 218897
 *                   reference: "FT24364030863634"
 *                   description: "hoi lai 100 bao mun dua"
 *                   amount: 16775000
 *                   runningBalance: 16775000
 *                   transactionDateTime: "2024-12-23 07:00:00"
 *                   accountNumber: "123456789"
 *                   bankName: "MBBank"
 *                   bankAbbreviation: "MBB"
 *                   virtualAccountNumber: ""
 *                   virtualAccountName: ""
 *                   counterAccountName: ""
 *                   counterAccountNumber: ""
 *                   counterAccountBankId: ""
 *                   counterAccountBankName: ""
 *     responses:
 *       200:
 *         description: Xử lý thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 */

router.post("/casso/webhook", async (req, res) => {
    try {
        const headers = req.headers;
        const body = req.body;

        if (!body || !body.data) {
            return sendResponseWithLog(res, req, { error: "Thiếu dữ liệu" }, 400);
        }

        const isValid = verifyWebhookSignature(
            headers,
            body.data,
            process.env.CASSO_FLOW_CHECKSUM_KEY
        );

        if (!isValid) {
            return sendResponseWithLog(res, req, { error: "Sai chữ ký, có thể giả mạo" }, 400);
        }

        const accountId = 1;
        const coinToAdd = 5000;

        await db.query(
            `UPDATE account SET coin = coin + $1 WHERE "accountId" = $2`,
            [coinToAdd, accountId]
        );

        await db.query(
            `INSERT INTO transaction_history ("accountId", dats, transaction_data, coin_change)
             VALUES ($1, NOW(), $2, $3)`,
            [accountId, `Cộng coin từ Casso giao dịch ${body.data.reference}`, coinToAdd]
        );

        const responseData = {
            message: "Cộng coin thành công",
            accountId,
            coinAdded: coinToAdd,
            transactionReference: body.data.reference,
            newBalance: "Có thể thêm query DB nếu muốn trả về số dư hiện tại"
        };

        return sendResponseWithLog(res, req, responseData, 200);

    } catch (err) {
        return sendResponseWithLog(res, req, { error: err.message }, 500);
    }
});

module.exports = router;
