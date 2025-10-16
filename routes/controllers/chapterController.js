const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../db");
const {log} = require("debug");
const sendMail = require("../utils/sendEmail");
require("dotenv").config();

exports.getChapterList = async (req,res) => {
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
}

exports.postAddNewChapter = async (req,res) => {
    try {
        const { novelId, chapterIndex, chapterTitle, chapterText, chapterStatusId } =
            req.body;

        if (!novelId || !chapterTitle || !chapterText || !chapterIndex || !chapterStatusId) {
            return res
                .status(400)
                .json({ error: "Thiếu param" });
        }

        const result = await pool.query(
            `INSERT INTO chapter ("novelId", "chapterIndex", "chapterTitle", "chapterText", "chapterStatusId", "createDate")
             VALUES ($1, $2, $3, $4, $5, NOW())
                 RETURNING "chapterId"`,
            [novelId, chapterIndex , chapterTitle, chapterText, chapterStatusId]
        );

        res.status(201).json({
            chapterId: result.rows[0].chapterid,
            message: "Thêm chapter thành công",
        });
    } catch (err) {
        console.error("❌ Lỗi khi thêm chapter:", err.message);
        res.status(500).json({ error: "Không thể thêm chapter mới" });
    }
}

exports.getChapterText = async (req,res) => {
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
}

exports.getChapterDetail = async (req,res) => {
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
}