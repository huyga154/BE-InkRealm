const pool = require("../config/db");

/**
 * Controller: Cập nhật trạng thái chương
 */
exports.updateChapterStatus = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { newChapterStatusId } = req.body;

        if (!chapterId || !newChapterStatusId) {
            return res.status(400).json({ message: "Thiếu chapterId hoặc newChapterStatusId" });
        }

        // ✅ Cập nhật trạng thái trong DB (đúng tên cột: updateDate)
        const result = await pool.query(
            `UPDATE "chapter"
             SET "chapterStatusId" = $1, "updateDate" = NOW()
             WHERE "chapterId" = $2
             RETURNING "chapterId", "chapterStatusId", "updateDate"`,
            [newChapterStatusId, chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương" });
        }

        res.json({
            message: "Đổi trạng thái chương thành công",
            chapter: result.rows[0],
        });
    } catch (err) {
        console.error("updateChapterStatus error:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái chương" });
    }
};



exports.getChapterStatusList = async (req, res) => {
    try {
        const { where } = req.chapterFilter || {};
        let query = `
            SELECT c."chapterId", c."chapterTitle", c."chapterStatusId", 
                   cs."chapterStatusCode", cs."chapterStatusDescription"
            FROM "chapter" c
            JOIN "chapter_status" cs ON c."chapterStatusId" = cs."chapterStatusId"
            JOIN "novel_info" n ON c."novelId" = n."novelId"
        `;

        if (where) {
            query += ` WHERE ${where}`;
        }

        query += ' ORDER BY c."chapterIndex" ASC';

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('getChapterStatusList error:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách chapter' });
    }
};

