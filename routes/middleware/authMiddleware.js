const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();


/**
 * Lấy role của user từ DB
 * @param {number} accountId
 * @returns {{id: number, name: string} | null}
 */
const getUserRoleFromDB = async (accountId) => {
    if (!accountId) return null;

    const query =
        `SELECT "role"."roleId", "role"."roleName"
        FROM "account"
                 JOIN "role" ON "account"."roleId" = "role"."roleId"
        WHERE "account"."accountId" = $1`
    ;


    const result = await pool.query(query, [accountId]);

    if (result.rowCount === 0) return null;

    return {
        id: Number(result.rows[0].roleId),
        name: result.rows[0].roleName.toUpperCase(),
    };
};

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const token = authHeader.split(" ")[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token hết hạn, vui lòng đăng nhập lại" });
        }
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};

/**
 * Chỉ cho phép MODERATOR hoặc ADMIN
 */
exports.verifyModeratorOrAdmin = async (req, res, next) => {
    try {
        const { accountId } = req.user;
        const role = await getUserRoleFromDB(accountId);

        if (!role) return res.status(403).json({ message: "Không tìm thấy vai trò người dùng" });

        if (["MODERATOR", "ADMIN"].includes(role.name)) return next();

        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    } catch (err) {
        console.error("verifyModeratorOrAdmin error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};

/**
 * Chỉ cho phép ADMIN
 */
exports.verifyAdmin = async (req, res, next) => {
    try {
        const { accountId } = req.user;
        const role = await getUserRoleFromDB(accountId);

        if (!role) return res.status(403).json({ message: "Không tìm thấy vai trò người dùng" });

        if (role.name === "ADMIN") return next();

        return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
    } catch (err) {
        console.error("verifyAdmin error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};