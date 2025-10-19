const pool = require("../config/db");

exports.verifyUploader = async (req, res, next) => {
    try {
        const { chapterId } = req.params;
        const accountId = req.user.accountId;

        const result = await pool.query(
            'SELECT "novelId" FROM "chapter" WHERE "chapterId"=$1',
            [chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Chương không tìm thấy" });
        }

        const chapter = result.rows[0];

        // Kiểm tra xem user có phải uploader của novel chứa chapter này không
        const checkUploader = await pool.query(
            'SELECT 1 FROM "uploader" WHERE "accountId"=$1 AND "novelId"=$2',
            [accountId, chapter.novelId]
        );

        if (checkUploader.rowCount === 0) {
            return res.status(403).json({ message: "Bạn không có quyền thay đổi chương này" });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};
