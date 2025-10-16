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
    if (!receivedSignature) return { valid: false };

    const match = receivedSignature.match(/t=(\d+),v1=([a-f0-9]+)/i);
    if (!match) return { valid: false };

    const timestamp = match[1];
    const signature = match[2];

    // Giữ nguyên thứ tự key, không sort
    const messageToSign = `${timestamp}.${JSON.stringify(data)}`;
    const generatedSignature = crypto
        .createHmac("sha512", checksumKey)
        .update(messageToSign)
        .digest("hex");

    return {
        valid: signature.toLowerCase() === generatedSignature.toLowerCase(),
        messageToSign,
        generatedSignature,
        receivedSignature: signature
    };
}

router.post("/casso/webhook", async (req, res) => {
    try {
        const headers = req.headers;
        const body = req.body;

        if (!body || !body.data) {
            return sendResponseWithLog(res, req, { error: "Thiếu dữ liệu" }, 400);
        }

        const result = verifyWebhookSignature(
            headers,
            body.data,
            process.env.CASSO_FLOW_CHECKSUM_KEY
        );

        // Debug: trả luôn messageToSign và generatedSignature để test
        if (!result.valid) {
            return sendResponseWithLog(res, req, {
                error: "Sai chữ ký, có thể giả mạo",
                debug: {
                    messageToSign: result.messageToSign,
                    generatedSignature: result.generatedSignature,
                    receivedSignature: result.receivedSignature
                }
            }, 400);
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
            newBalance: "Có thể thêm query DB nếu muốn trả về số dư hiện tại",
            // Có thể thêm debug nếu muốn kiểm tra chữ ký đúng
            debug: {
                messageToSign: result.messageToSign,
                generatedSignature: result.generatedSignature,
                receivedSignature: result.receivedSignature
            }
        };

        return sendResponseWithLog(res, req, responseData, 200);

    } catch (err) {
        return sendResponseWithLog(res, req, { error: err.message }, 500);
    }
});

module.exports = router;
