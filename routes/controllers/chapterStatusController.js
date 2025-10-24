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

/**
 * Lấy danh sách status mà role có quyền xem
 * @param {number} roleId
 * @returns {Array<{chapterStatusId: number, chapterStatusCode: string, chapterStatusDescription: string}>}
 */
exports.getAccessibleStatusByRole = async (roleId) => {
    if (!roleId) return [];

    // Admin: trả về tất cả status
    if (roleId === 2) {
        const statusResult = await pool.query(`
            SELECT "chapterStatusId", "chapterStatusCode", "chapterStatusDescription"
            FROM "chapter_status"
            ORDER BY "chapterStatusId" ASC
        `);
        return statusResult.rows;
    }

    // User / Moderator: lấy status từ role_status_rule (fromStatusId + toStatusId)
    const statusResult = await pool.query(`
        SELECT DISTINCT chapter_status."chapterStatusId",
                        chapter_status."chapterStatusCode",
                        chapter_status."chapterStatusDescription"
        FROM (
                 SELECT "fromStatusId" AS statusId
                 FROM "role_status_rule"
                 WHERE "roleId" = $1
                 UNION
                 SELECT "toStatusId" AS statusId
                 FROM "role_status_rule"
                 WHERE "roleId" = $1
             ) AS role_status_union
                 INNER JOIN "chapter_status" AS chapter_status
                            ON chapter_status."chapterStatusId" = role_status_union.statusId
        ORDER BY chapter_status."chapterStatusId" ASC
    `, [roleId]);

    return statusResult.rows;
};

/**
 * API: uploader chỉ xem được status các chapter thuộc novel do họ sở hữu
 */
exports.getUploaderChapterStatus = async (req, res) => {
    try {
        const { accountId } = req.user;

        const roleResult = await pool.query(`
            SELECT "roleId"
            FROM "account"
            WHERE "accountId" = $1
        `, [accountId]);

        if (!roleResult.rows.length) return res.status(403).json({ message: "Không tìm thấy role" });

        const roleId = roleResult.rows[0].roleId;
        const statuses = await exports.getAccessibleStatusByRole(roleId);
        const statusIds = statuses.map(status => status.chapterStatusId);

        req.chapterFilter = {
            where: statusIds.length
                ? `"novel_info"."accountId" = ${accountId} AND "chapter"."chapterStatusId" = ANY(ARRAY[${statusIds.join(",")}])`
                : "FALSE"
        };

        res.json(statuses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách trạng thái" });
    }
};

/**
 * API: moderator xem được status theo role_status_rule
 */
exports.getModeratorChapterStatus = async (req, res) => {
    try {
        const { accountId } = req.user;

        const roleResult = await pool.query(`
            SELECT "roleId"
            FROM "account"
            WHERE "accountId" = $1
        `, [accountId]);

        if (!roleResult.rows.length) return res.status(403).json({ message: "Không tìm thấy role" });

        const roleId = roleResult.rows[0].roleId;
        const statuses = await exports.getAccessibleStatusByRole(roleId);
        const statusIds = statuses.map(status => status.chapterStatusId);

        req.chapterFilter = {
            where: statusIds.length
                ? `"chapter"."chapterStatusId" = ANY(ARRAY[${statusIds.join(",")}])`
                : "FALSE"
        };

        res.json(statuses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách trạng thái" });
    }
};

/**
 * API: admin xem tất cả status
 */
exports.getAdminChapterStatus = async (req, res) => {
    try {
        const statusResult = await pool.query(`
            SELECT "chapterStatusId", "chapterStatusCode", "chapterStatusDescription"
            FROM "chapter_status"
            ORDER BY "chapterStatusId" ASC
        `);

        const statuses = statusResult.rows;
        req.chapterFilter = {}; // admin lấy tất cả
        res.json(statuses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách trạng thái" });
    }
};