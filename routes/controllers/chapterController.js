const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {log} = require("debug");
const sendMail = require("../utils/sendEmail");
require("dotenv").config();

exports.getChapterList = async (req, res) => {
    try {
        const { novelId } = req.params; // lấy từ path param /chapter/list/:novelId

        if (!novelId || isNaN(parseInt(novelId))) {
            return res.status(400).json({ error: "Thiếu hoặc không hợp lệ novelId" });
        }

        const result = await pool.query(
            `SELECT "chapterId", "chapterTitle", "chapterIndex", "createDate", "updateDate", "chapterStatusId"
             FROM "chapter"
             WHERE "novelId" = $1
             ORDER BY "chapterIndex" ASC`,
            [novelId]
        );

        res.status(200).json({
            success: true,
            novelId: Number(novelId),
            chapters: result.rows
        });
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách chapter theo novelId:", err.message);
        res.status(500).json({ error: "Không lấy được danh sách chapter" });
    }
};

exports.postAddNewChapter = async (req, res) => {
    try {
        const { novelId, chapterIndex, chapterTitle, chapterText } = req.body;

        if (!novelId || !chapterTitle || !chapterText || chapterIndex == null) {
            return res.status(400).json({ error: "Thiếu param" });
        }

        // 🔹 Kiểm tra xem index đã tồn tại trong truyện này chưa
        const checkIndex = await pool.query(
            `SELECT 1 FROM chapter WHERE "novelId"=$1 AND "chapterIndex"=$2`,
            [novelId, chapterIndex]
        );

        if (checkIndex.rowCount > 0) {
            return res.status(400).json({
                error: `Index số ${chapterIndex} đã tồn tại trong truyện này`
            });
        }

        const result = await pool.query(
            `INSERT INTO chapter 
             ("novelId", "chapterIndex", "chapterTitle", "chapterText", "chapterStatusId", "createDate")
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING "chapterId"`,
            [novelId, chapterIndex, chapterTitle, chapterText, 2] // 2 = draft/active status
        );

        res.status(201).json({
            chapterId: result.rows[0].chapterid,
            message: "Thêm chapter thành công",
        });
    } catch (err) {
        console.error("❌ Lỗi khi thêm chapter:", err.message);
        res.status(500).json({ error: "Không thể thêm chapter mới" });
    }
};

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

exports.putChangeChapterStatus = async (req, res) => {
    try {
        const { chapterId, chapterStatusId } = req.params;

        // Kiểm tra param hợp lệ
        if (!chapterId || isNaN(parseInt(chapterId))) {
            return res.status(400).json({ message: "chapterId không hợp lệ" });
        }
        if (!chapterStatusId || isNaN(parseInt(chapterStatusId))) {
            return res.status(400).json({ message: "chapterStatusId không hợp lệ" });
        }

        // Cập nhật trạng thái
        const result = await pool.query(
            `UPDATE "chapter"
             SET "chapterStatusId" = $1, "updateDate" = NOW()
             WHERE "chapterId" = $2
             RETURNING "chapterId", "chapterStatusId"`,
            [chapterStatusId, chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Chương không tồn tại" });
        }

        res.json({
            success: true,
            message: "Trạng thái chapter đã được cập nhật",
            chapter: result.rows[0]
        });

    } catch (err) {
        console.error("putChangeChapterStatus error:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái chapter" });
    }
};

exports.putUpdateChapterText = async (req, res) => {
    try {
        const { chapterId, chapterText } = req.body;

        // ✅ Kiểm tra đầu vào
        if (!chapterId || isNaN(chapterId)) {
            return res.status(400).json({ message: "chapterId không hợp lệ" });
        }

        if (!chapterText || typeof chapterText !== "string" || chapterText.trim() === "") {
            return res.status(400).json({ message: "Thiếu hoặc sai định dạng nội dung chương (chapterText)" });
        }

        // ✅ Cập nhật nội dung chương
        const result = await pool.query(
            `UPDATE "chapter"
             SET "chapterText" = $1,
                 "updateDate" = NOW()
             WHERE "chapterId" = $2
             RETURNING "chapterId", "chapterTitle", "chapterText", "updateDate"`,
            [chapterText.trim(), chapterId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương cần cập nhật" });
        }

        // ✅ Phản hồi
        return res.status(200).json({
            message: "Cập nhật nội dung chương thành công",
            chapter: result.rows[0],
        });

    } catch (err) {
        console.error("putUpdateChapterText error:", err);
        return res.status(500).json({ message: "Lỗi khi cập nhật nội dung chương" });
    }
};




