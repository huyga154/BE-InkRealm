const pool = require("../config/db");

exports.verifyUploader = async (req, res, next) => {
    try {
        const { chapterId } = req.params;
        const accountId = req.user?.accountId;

        if (!chapterId || !accountId) {
            return res.status(400).json({ message: "Thiếu thông tin chapterId hoặc accountId" });
        }

        // Lấy novelId và accountId của uploader từ chapter
        const result = await pool.query(
            `SELECT c."novelId", n."accountId" AS "uploaderId"
             FROM "chapter" c
             JOIN "novel_info" n ON c."novelId" = n."novelId"
             WHERE c."chapterId" = $1`,
            [chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Chương không tìm thấy" });
        }

        const { uploaderId } = result.rows[0];

        // Kiểm tra quyền
        if (uploaderId !== accountId) {
            return res.status(403).json({ message: "Bạn không có quyền hạn thay đổi chương này" });
        }

        next();
    } catch (err) {
        console.error("verifyUploader error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};

