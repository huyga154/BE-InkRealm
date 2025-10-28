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

module.exports = router;
