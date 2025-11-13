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

exports.verifyNovelUploader = async (req, res, next) => {
    try {
        const { novelId } = req.params; // có thể lấy từ req.body nếu bạn gửi qua body
        const accountId = req.user?.accountId;

        if (!novelId || !accountId) {
            return res.status(400).json({ message: "Thiếu thông tin novelId hoặc accountId" });
        }

        // Lấy accountId của uploader từ bảng novel_info
        const result = await pool.query(
            `SELECT "accountId" FROM "novel_info" WHERE "novelId" = $1`,
            [novelId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy truyện" });
        }

        const { accountId: uploaderId } = result.rows[0];

        // Nếu người đăng nhập không phải là người đăng truyện → chặn
        if (uploaderId !== accountId) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa truyện này" });
        }

        next();

    } catch (err) {
        console.error("verifyNovelUploader error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};

exports.resetStatusToDraft = async (req, res, next) => {
    try {
        const { chapterId } = req.params;

        if (!chapterId) {
            return res.status(400).json({ message: "Thiếu chapterId trong request body" });
        }

        // 🔍 Lấy id của status "draft"
        const draftStatus = await pool.query(
            `SELECT "chapterStatusId"
             FROM "chapter_status"
             WHERE LOWER("chapterStatusCode") = 'draft'
             LIMIT 1`
        );

        if (draftStatus.rows.length === 0) {
            return res.status(500).json({ message: "Không tìm thấy trạng thái 'draft' trong hệ thống" });
        }

        const draftStatusId = draftStatus.rows[0].chapterStatusId;

        // 🔄 Cập nhật chương -> chuyển sang draft luôn
        await pool.query(
            `UPDATE "chapter"
             SET "chapterStatusId" = $1
             WHERE "chapterId" = $2`,
            [draftStatusId, chapterId]
        );

        console.log(`🔄 Chương ${chapterId} bị chỉnh sửa → chuyển trạng thái sang 'draft'`);

        next();
    } catch (err) {
        console.error("resetStatusToDraft error:", err);
        return res.status(500).json({ message: "Lỗi khi chuyển trạng thái chương sang draft" });
    }
};

