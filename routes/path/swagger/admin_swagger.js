const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Revenue
 *   description: API thống kê doanh thu (Admin Dashboard)
 */

/**
 * @swagger
 * /admin/dashboard/revenue/today:
 *   get:
 *     summary: Lấy doanh thu hôm nay
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Doanh thu của ngày hôm nay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2025-10-28"
 *                 revenue:
 *                   type: integer
 *                   example: 25000
 */

/**
 * @swagger
 * /admin/dashboard/revenue/date/{date}:
 *   get:
 *     summary: Lấy doanh thu theo ngày cụ thể
 *     tags: [Revenue]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Ngày cần thống kê (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           example: "2025-10-25"
 *     responses:
 *       200:
 *         description: Doanh thu theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 revenue:
 *                   type: integer
 */

/**
 * @swagger
 * /admin/dashboard/revenue/range/{from}/{to}:
 *   get:
 *     summary: Lấy doanh thu tổng & chi tiết theo ngày trong khoảng thời gian
 *     tags: [Revenue]
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-10-01"
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-10-28"
 *     responses:
 *       200:
 *         description: Thống kê doanh thu trong khoảng ngày
 *         content:
 *           application/json:
 *             example:
 *               from: "2025-10-01"
 *               to: "2025-10-28"
 *               totalRevenue: 125000
 *               dailyRevenue:
 *                 - date: "2025-10-01"
 *                   revenue: 20000
 *                 - date: "2025-10-02"
 *                   revenue: 15000
 */

/**
 * @swagger
 * /admin/dashboard/revenue/year:
 *   get:
 *     summary: Lấy doanh thu của năm hiện tại
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Doanh thu trong năm hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                   example: 2025
 *                 revenue:
 *                   type: integer
 *                   example: 520000
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API cho admin
 */

/**
 * @swagger
 * /admin/roles/all:
 *   get:
 *     summary: Lấy tất cả role trong hệ thống
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Danh sách role được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   roleId:
 *                     type: integer
 *                     example: 1
 *                   roleName:
 *                     type: string
 *                     example: ADMIN
 *                   roleDescription:
 *                     type: string
 *                     example: Quản trị viên hệ thống
 */

/**
 * @swagger
 * /admin/account/create:
 *   post:
 *     summary: Admin tạo tài khoản mới
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - roleId
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin01
 *               password:
 *                 type: string
 *                 example: 123456
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Minh Huy
 *               email:
 *                 type: string
 *                 example: huy@example.com
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.png
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created
 *                 account:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: integer
 *                       example: 5
 *                     username:
 *                       type: string
 *                       example: admin01
 *                     roleId:
 *                       type: integer
 *                       example: 2
 */

/**
 * @swagger
 * /admin/account/{accountId}/update:
 *   put:
 *     summary: Cập nhật thông tin tài khoản
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: new_admin
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Minh Huy
 *               email:
 *                 type: string
 *                 example: huy@example.com
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar2.png
 *               roleId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account updated
 *                 account:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: integer
 *                       example: 5
 *                     username:
 *                       type: string
 *                       example: new_admin
 *                     roleId:
 *                       type: integer
 *                       example: 3
 */

/**
 * @swagger
 * /admin/account/{accountId}/delete:
 *   delete:
 *     summary: Xóa tài khoản theo ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted
 */


module.exports = router;
