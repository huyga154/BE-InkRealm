const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /user/transaction:
 *   get:
 *     summary: Lấy lịch sử giao dịch của tài khoản hiện tại
 *     description: |
 *       Lấy **tối đa 10 bản ghi giao dịch gần nhất** của tài khoản dựa vào token JWT.
 *       Nếu có truyền `transactionId`, API sẽ chỉ lấy các giao dịch **có ID nhỏ hơn giá trị đó** (dùng để "load thêm" giao dịch cũ hơn).
 *
 *       - 🧾 Lần đầu: `GET /transaction` → Lấy 10 giao dịch mới nhất
 *       - 🔁 Lần sau: `GET /transaction?transactionId=123` → Lấy 10 giao dịch cũ hơn ID 123
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: transactionId
 *         required: false
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID của giao dịch gần nhất đã đọc (để phân trang, tùy chọn)
 *     responses:
 *       200:
 *         description: Lấy lịch sử giao dịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy lịch sử giao dịch thành công
 *                 hasMore:
 *                   type: boolean
 *                   example: true
 *                   description: Cho biết còn dữ liệu cũ hơn để load tiếp hay không
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: integer
 *                         example: 125
 *                       dats:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-13T10:12:45.000Z
 *                       transaction_data:
 *                         type: string
 *                         example: Mua chương 15 của truyện 'Ma đạo tổ sư'
 *                       coin_change:
 *                         type: string
 *                         example: "-15"
 *       401:
 *         description: Không tìm thấy accountId trong token hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy accountId trong token
 *       500:
 *         description: Lỗi server khi lấy lịch sử giao dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi server khi lấy lịch sử giao dịch
 */

module.exports = router;
