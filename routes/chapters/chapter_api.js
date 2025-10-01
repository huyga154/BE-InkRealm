var express = require('express');
var router = express.Router();
const pool = require("../../db");

/**
 * @swagger
 * tags:
 *   name: Chapter
 *   description: API cho truyện
 */


/**
 * @swagger
 * /chapter/list:
 *   get:
 *     summary: Lấy danh sách chapter theo novelId
 *     tags: [Chapter]
 *     parameters:
 *       - in: query
 *         name: novelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của novel
 *     responses:
 *       200:
 *         description: Danh sách chapter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chapterId:
 *                     type: integer
 *                   chapterTitle:
 *                     type: string
 *                   index:
 *                     type: number
 *                   createDate:
 *                     type: string
 *                     format: date-time
 *                   updateDate:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Thiếu novelId
 *       500:
 *         description: Lỗi server
 */
// Lấy danh sách chapter theo novelId
router.get("/chapter/list/", async (req, res) => {
    try {
        const { novelId } = req.body; // lấy từ URL param

        if (!novelId) {
            return res.status(400).json({ error: "Thiếu novelId trong request" });
        }

        const result = await pool.query(
            `SELECT "chapterId", "chapterTitle", "index", "createDate", "updateDate"
             FROM chapter
             WHERE "novelId" = $1
             ORDER BY "index" ASC`,
            [novelId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách chapter theo novelId:", err.message);
        res.status(500).json({ error: "Không tìm thấy danh sách chapter" });
    }
});

/**
 * @swagger
 * /chapter/add:
 *   post:
 *     summary: Thêm chapter mới
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novelId
 *               - chapterTitle
 *               - chapterText
 *             properties:
 *               novelId:
 *                 type: integer
 *                 example: 1
 *               index:
 *                 type: number
 *                 example: 1
 *               chapterTitle:
 *                 type: string
 *                 example: "Chương 1 - Khởi đầu"
 *               chapterText:
 *                 type: string
 *                 example: "Nội dung chương 1..."
 *               chapterStatusId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Chapter mới được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterId:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *       500:
 *         description: Lỗi server
 */
router.post("/add", async (req, res) => {
    try {
        const { novelId, chapterIndex, chapterTitle, chapterText, chapterStatusId } =
            req.body;

        if (!novelId || !chapterTitle || !chapterText) {
            return res
                .status(400)
                .json({ error: "Thiếu novelId, chapterTitle hoặc chapterText" });
        }

        const result = await pool.query(
            `INSERT INTO chapter ("novelId", "chapterIndex", "chapterTitle", "chapterText", "chapterStatusId", "createDate")
             VALUES ($1, $2, $3, $4, $5, NOW())
                 RETURNING "chapterId"`,
            [novelId, chapterIndex || 1, chapterTitle, chapterText, chapterStatusId || 1]
        );

        res.status(201).json({
            chapterId: result.rows[0].chapterid,
            message: "Thêm chapter thành công",
        });
    } catch (err) {
        console.error("❌ Lỗi khi thêm chapter:", err.message);
        res.status(500).json({ error: "Không thể thêm chapter mới" });
    }
});

module.exports = router;