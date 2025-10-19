const pool = require("../config/db");
require("dotenv").config();

const STATUS = {
    PUBLIC: 1,
    DRAFT: 2,
    COMPLETE: 3,
    WAIT_FOR_PUBLIC: 4,
    WANT_TO_VERIFY: 5,
    VERIFIED: 6,
    REFUSE: 7,
};

const ROLE_RULES = {
    user: [
        [STATUS.DRAFT, STATUS.WANT_TO_VERIFY],
        [STATUS.VERIFIED, STATUS.PUBLIC],
        [STATUS.PUBLIC, STATUS.DRAFT],
        [STATUS.REFUSE, STATUS.DRAFT],
    ],
    moderator: [
        [STATUS.WANT_TO_VERIFY, STATUS.VERIFIED],
        [STATUS.WANT_TO_VERIFY, STATUS.REFUSE],
        [STATUS.REFUSE, STATUS.VERIFIED],
    ],
    admin: Object.values(STATUS).flatMap(from =>
        Object.values(STATUS).map(to => [from, to])
    ),
};

function statusName(id) {
    const entry = Object.entries(STATUS).find(([_, v]) => v === id);
    return entry ? entry[0] : "Unknown";
}

/**
 * 🧩 Middleware kiểm tra quyền đổi trạng thái chương
 */
exports.verifyChangeChapterStatus = async (req, res, next) => {
    try {
        const { chapterId, newChapterStatusId } = req.body;
        const role = req.user?.role;

        if (!chapterId || !newChapterStatusId) {
            return res.status(400).json({
                message: "Thiếu thông tin chapterId hoặc newChapterStatusId",
            });
        }

        // 🔍 Lấy trạng thái hiện tại từ DB
        const result = await pool.query(
            `SELECT "chapterStatusId" FROM "chapter" WHERE "chapterId" = $1`,
            [chapterId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương" });
        }

        const oldStatus = result.rows[0].chapterStatusId;
        const newStatus = Number(newChapterStatusId);
        const rules = ROLE_RULES[role];

        if (!rules) {
            return res.status(403).json({
                message: "Vai trò không hợp lệ hoặc không có quyền thay đổi trạng thái",
            });
        }

        const valid = rules.some(([from, to]) => from === oldStatus && to === newStatus);

        if (!valid) {
            return res.status(400).json({
                message: `Không thể đổi trạng thái từ ${statusName(oldStatus)} sang ${statusName(newStatus)} với vai trò ${role}`,
            });
        }

        next();
    } catch (err) {
        console.error("verifyChangeChapterStatus error:", err);
        res.status(500).json({ message: "Lỗi kiểm tra trạng thái chương" });
    }
};

exports.STATUS = STATUS;
