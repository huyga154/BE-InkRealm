const pool = require("../config/db");

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
        [STATUS.WANT_TO_VERIFY, STATUS.DRAFT],
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

/**
 * Middleware: kiểm tra quyền thay đổi trạng thái chapter
 * Lấy chapterId từ params và newChapterStatusId từ params
 */
exports.verifyChangeChapterStatus = async (req, res, next) => {
    try {
        const { chapterId, chapterStatusId } = req.params;
        const accountId = req.user?.accountId;

        if (!chapterId || !chapterStatusId) {
            return res.status(400).json({ message: "Thiếu chapterId hoặc chapterStatusId" });
        }

        // Lấy role của user từ DB
        const roleResult = await pool.query(
            'SELECT r."roleName" AS role FROM "account" a JOIN "role" r ON a."roleId"=r."roleId" WHERE a."accountId"=$1',
            [accountId]
        );
        if (!roleResult.rows.length) {
            return res.status(403).json({ message: "Không tìm thấy vai trò của user" });
        }
        const role = roleResult.rows[0].role.toLowerCase(); // 'user', 'moderator', 'admin'

        // Lấy trạng thái hiện tại
        const result = await pool.query(
            `SELECT "chapterStatusId" AS "currentChapterStatus"
             FROM "chapter"
             WHERE "chapterId" = $1`,
            [chapterId]
        );
        if (!result.rows.length) {
            return res.status(404).json({ message: "Chương không tồn tại" });
        }

        const { currentChapterStatus } = result.rows[0];
        const oldStatus = currentChapterStatus;
        const newStatus = Number(chapterStatusId);
        const rules = ROLE_RULES[role];

        if (!rules) {
            return res.status(403).json({ message: "Vai trò không hợp lệ hoặc không có quyền thay đổi trạng thái này" });
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



function statusName(id) {
    const entry = Object.entries(STATUS).find(([_, v]) => v === id);
    return entry ? entry[0] : "Unknown";
}


// middleware/chapterStatusAccess.js
exports.uploaderAccess = async (req, res, next) => {
    try {
        const { accountId } = req.user;
        // chỉ lấy các chapter thuộc novel do user sở hữu
        req.chapterFilter = {
            where: `"novel_info"."accountId" = ${accountId}`
        };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.moderatorAccess = async (req, res, next) => {
    try {
        const statusIds = ROLE_RULES.moderator.flatMap(([from, to]) => [from, to]);
        req.chapterFilter = {
            where: `"chapter"."chapterStatusId" = ANY(ARRAY[${statusIds.join(',')}])`
        };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.adminAccess = async (req, res, next) => {
    // admin lấy tất cả chapter
    req.chapterFilter = {}; // không cần where
    next();
};
