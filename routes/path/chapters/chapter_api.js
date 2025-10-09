var express = require('express');
var router = express.Router();
const pool = require("../../../db");
const { verifyToken } = require("../../middleware/authMiddleware");

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
 *           example: 1
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
 *                   chapterIndex:
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
router.get("/list", async (req, res) => {
    try {
        const { novelId } = req.query; // lấy từ query param ?novelId=1

        if (!novelId) {
            return res.status(400).json({ error: "Thiếu novelId trong query" });
        }

        const result = await pool.query(
            `SELECT "chapterId", "chapterTitle", "chapterIndex", "createDate", "updateDate"
             FROM chapter
             WHERE "novelId" = $1
             ORDER BY "chapterIndex" ASC`,
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

/**
 * @swagger
 * /chapter/text:
 *   get:
 *     summary: Lấy nội dung chương (có kiểm tra quyền truy cập)
 *     tags: [Chapter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: integer
 *           example: 1188
 *         required: true
 *         description: ID của chương cần lấy nội dung
 *     responses:
 *       200:
 *         description: Trả về nội dung chương (nếu được phép đọc)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterText:
 *                   type: string
 *                   example: "Đây là nội dung chương 1..."
 *       400:
 *         description: Thiếu chapterId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Thiếu chapterId"
 *       403:
 *         description: Chương cần mua để đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chương này cần mua để đọc"
 *                 price:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Không tìm thấy chương
 *       500:
 *         description: Lỗi server
 */
router.get("/text", verifyToken, async (req, res) => {
    try {
        const { chapterId } = req.query;
        const accountId = req.user.id; // lấy từ token

        if (!chapterId) {
            return res.status(400).json({ error: "Thiếu chapterId" });
        }

        // 1️⃣ Lấy thông tin chương (bao gồm price và novelId)
        const chapterResult = await pool.query(
            `SELECT "chapterId", "novelId", "chapterText", "price"
            FROM "chapter"
            WHERE "chapterId" = $1`,
            [chapterId]
        );

        if (chapterResult.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy chapter" });
        }

        const chapter = chapterResult.rows[0];

        // 2️⃣ Nếu miễn phí → cho đọc luôn
        if (chapter.price === 0) {
            return res.json({ chapterText: chapter.chapterText });
        }

        // 3️⃣ Kiểm tra user đã mua chương hoặc mua truyện chưa
        const [purchaseChapter, purchaseNovel] = await Promise.all([
            pool.query(
                `SELECT 1 FROM "chapter_purchase"
         WHERE "accountId" = $1 AND "chapterId" = $2`,
                [accountId, chapterId]
            ),
            pool.query(
                `SELECT 1 FROM "novel_purchase"
         WHERE "accountId" = $1 AND "novelId" = $2`,
                [accountId, chapter.novelId]
            ),
        ]);

        const hasPurchasedChapter = purchaseChapter.rows.length > 0;
        const hasPurchasedNovel = purchaseNovel.rows.length > 0;

        // 4️⃣ Nếu đã mua → cho đọc
        if (hasPurchasedChapter || hasPurchasedNovel) {
            return res.json({ chapterText: chapter.chapterText });
        }

        // 5️⃣ Nếu chưa mua → trả về thông báo và giá
        return res.status(403).json({
            error: "Chương này cần mua để đọc",
            price: chapter.price,
        });

    } catch (err) {
        console.error("❌ Lỗi khi lấy data chapter:", err.message);
        res.status(500).json({ error: "Không thể lấy text của chapter" });
    }
});

/**
 * @swagger
 * /chapter/detail:
 *   get:
 *     summary: Lấy chi tiết một chapter theo chapterId, kèm chapter trước và sau (chỉ chapterId)
 *     tags: [Chapter]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1188
 *         description: ID của chapter cần lấy
 *     responses:
 *       200:
 *         description: Thông tin chi tiết chapter và pre/next
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterId:
 *                   type: integer
 *                 chapterTitle:
 *                   type: string
 *                 chapterIndex:
 *                   type: number
 *                 pre:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *                 next:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *       400:
 *         description: Thiếu chapterId
 *       404:
 *         description: Không tìm thấy chapter
 *       500:
 *         description: Lỗi server
 */
router.get("/detail", async (req, res) => {
    try {
        const { chapterId } = req.query;

        if (!chapterId) {
            return res.status(400).json({ error: "Thiếu chapterId" });
        }

        // Lấy thông tin chapter hiện tại
        const current = await pool.query(
            `SELECT "chapterId", "chapterTitle", "chapterIndex", "novelId"
             FROM "chapter"
             WHERE "chapterId" = $1`,
            [chapterId]
        );

        if (current.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy chapter" });
        }

        const chapter = current.rows[0];

        // Chương trước trong cùng novel
        const pre = await pool.query(
            `SELECT "chapterId"
             FROM "chapter"
             WHERE "novelId" = $1
             AND "chapterIndex" < $2
             ORDER BY "chapterIndex" DESC
             LIMIT 1`,
            [chapter.novelId, chapter.chapterIndex]
        );

        // Chương sau trong cùng novel
        const next = await pool.query(
            `SELECT "chapterId"
             FROM "chapter"
             WHERE "novelId" = $1
             AND "chapterIndex" > $2
             ORDER BY "chapterIndex" ASC
             LIMIT 1`,
            [chapter.novelId, chapter.chapterIndex]
        );

        res.json({
            chapterId: chapter.chapterId,
            chapterTitle: chapter.chapterTitle,
            chapterIndex: chapter.chapterIndex,
            pre: pre.rows[0] || null,
            next: next.rows[0] || null
        });
    } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết chapter:", err.message);
        res.status(500).json({ error: "Không thể lấy chi tiết chapter" });
    }
});

module.exports = router;