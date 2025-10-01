var express = require('express');
var router = express.Router();
const pool = require("../../db");

/**
 * @swagger
 * tags:
 *   name: Novels
 *   description: API cho truyện
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Novel:
 *       type: object
 *       properties:
 *         novelId:
 *           type: integer
 *           example: 1
 *         novelTitle:
 *           type: string
 *           example: "Đại Đường Song Long Truyện"
 *         novelDescription:
 *           type: string
 *           example: "Một bộ truyện huyền ảo võ hiệp"
 *         createDate:
 *           type: string
 *           format: date-time
 *           example: "2025-09-24T12:00:00.000Z"
 *         author:
 *           type: string
 *           example: "Huynh Huynh"
 */

/**
 * @swagger
 * /novel/all:
 *   post:
 *     summary: Lấy tất cả novels
 *     tags: [Novels]
 *     responses:
 *       200:
 *         description: Danh sách novels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Novel'
 */
router.post("/all", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM novel_info ORDER BY "novelId" ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /novel/novelId:
 *   post:
 *     summary: Lấy novel theo ID
 *     tags: [Novels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storyId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Novel được tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Novel'
 *       400:
 *         description: Thiếu storyId
 *       404:
 *         description: Không tìm thấy novel
 */
router.post("/novelId", async (req, res) => {
    try {
        const { storyId } = req.body;

        if (!storyId) {
            return res.status(400).json({ error: "Thiếu id trong request body" });
        }

        const result = await pool.query(
            `SELECT * FROM novel_info WHERE "novelId" = $1`,
            [storyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy novel" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("❌ Lỗi khi lấy novel theo id:", err.message);
        res.status(500).json({ error: "Lỗi server" });
    }
});

/**
 * @swagger
 * /novel/create:
 *   post:
 *     summary: Tạo mới một truyện (novel_info)
 *     tags:
 *       - Novels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               novelTitle:
 *                 type: string
 *                 example: "Quỷ Bí Chi Chủ"
 *               novelDescription:
 *                 type: string
 *                 example: "Mô tả về truyện..."
 *               author:
 *                 type: string
 *                 example: "Mực Thích Lặn Nước"
 *     responses:
 *       200:
 *         description: Novel được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 novelId:
 *                   type: integer
 *                 novelTitle:
 *                   type: string
 *                 novelDescription:
 *                   type: string
 *                 author:
 *                   type: string
 *       400:
 *         description: Thiếu trường thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 */
router.post("/create", async (req, res) => {
    try {
        const { novelTitle, novelDescription, author } = req.body;

        if (!novelTitle || !author) {
            return res.status(400).json({ error: "Thiếu novelTitle hoặc author" });
        }

        const result = await pool.query(
            `INSERT INTO novel_info ("novelTitle", "novelDescription", "author")
             VALUES ($1, $2, $3)
                 RETURNING "novelId", "novelTitle", "novelDescription", "author", "createDate"`,
            [novelTitle, novelDescription || "", author]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("❌ Lỗi khi tạo novel:", err.message);
        if (err.code === "23505") { // lỗi duplicate key
            return res.status(400).json({ error: "Truyện đã tồn tại" });
        }
        res.status(500).json({ error: "Lỗi server" });
    }
});

module.exports = router;
