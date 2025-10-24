const pool = require("../config/db");

exports.verifyChangeChapterStatus = async (req, res, next) => {
    try {
        const { chapterId, chapterStatusId } = req.params;
        const accountId = req.user?.accountId;

        if (!chapterId || !chapterStatusId) {
            return res.status(400).json({ message: "Thiếu chapterId hoặc chapterStatusId" });
        }

        // Lấy roleId và roleName của user
        const roleRes = await pool.query(
            `SELECT a."roleId", r."roleName"
             FROM "account" a
             JOIN "role" r ON a."roleId" = r."roleId"
             WHERE a."accountId" = $1`,
            [accountId]
        );
        if (!roleRes.rows.length) {
            return res.status(403).json({ message: "Không tìm thấy vai trò user" });
        }
        const { roleId, roleName } = roleRes.rows[0];

        // Lấy trạng thái hiện tại của chapter
        const chapterRes = await pool.query(
            `SELECT "chapterStatusId" AS "currentChapterStatus"
             FROM "chapter"
             WHERE "chapterId" = $1`,
            [chapterId]
        );
        if (!chapterRes.rows.length) {
            return res.status(404).json({ message: "Chương không tồn tại" });
        }

        const oldStatus = chapterRes.rows[0].currentChapterStatus;
        const newStatus = Number(chapterStatusId);

        // Kiểm tra quyền đổi trạng thái từ DB
        const ruleRes = await pool.query(
            `SELECT 1 FROM "role_status_rule"
             WHERE "roleId" = $1 AND "fromStatusId" = $2 AND "toStatusId" = $3`,
            [roleId, oldStatus, newStatus]
        );

        if (!ruleRes.rows.length) {
            return res.status(400).json({
                message: `Role ${roleName} không được đổi trạng thái này`,
            });
        }

        next();
    } catch (err) {
        console.error("verifyChangeChapterStatus error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền đổi trạng thái" });
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
