const express = require("express");
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

module.exports = router;
