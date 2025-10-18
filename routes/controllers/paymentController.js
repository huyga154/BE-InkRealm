const express = require("express");
const crypto = require("crypto");
const db = require("../config/db");
const payos = require("../utils/payos");
require("dotenv").config();

exports.postWebHookCasso = async (req,res) => {
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
            return res.status(200).json({ error: description });
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
            [userId,"Nạp tiền vào tài khoản. Mã giao dịch là : " + description, "+" + coinToAdd]
        );

        console.log(`✅ Cộng ${coinToAdd} coin cho accountId = ${userId}`);
        res.json({ message: "OK" });
    } catch (err) {
        console.error("🔥 Lỗi webhook:", err);
        res.status(500).json({ error: err.message });
    }
}

exports.postCreatePaymentLink = async (req,res) => {
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
}