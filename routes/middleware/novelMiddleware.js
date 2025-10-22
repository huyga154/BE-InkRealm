const pool = require("../config/db");

exports.checkNovelOwner = async (req, res, next) => {
    try {
        const userId = req.user.accountId;
        const { novelId } = req.body;
        if (!novelId) return res.status(400).json({ message: "Thiếu novelId" });

        const result = await pool.query(
            'SELECT "accountId" FROM novel_info WHERE "novelId" = $1',
            [novelId]
        );

        const ownerId = result.rows[0]?.accountId;
        if (!ownerId) return res.status(404).json({ message: "Truyện không tồn tại" });

        if (ownerId !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa truyện này" });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi kiểm tra quyền sở hữu truyện", error: err.message });
    }
};