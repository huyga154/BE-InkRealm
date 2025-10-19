const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token hết hạn, vui lòng đăng nhập lại" });
        }
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};


/**
 * Helper: Lấy roleId thật từ database
 */
const getUserRoleFromDB = async (accountId) => {
    const result = await pool.query(
        'SELECT "roleId" FROM "account" WHERE "accountId" = $1',
        [accountId]
    );
    if (result.rowCount === 0) return null;
    return result.rows[0].roleId;
};

/**
 * Middleware: chỉ cho phép Moderator hoặc Admin
 */
exports.verifyModeratorOrAdmin = async (req, res, next) => {
    try {
        const { accountId } = req.user;
        const roleId = await getUserRoleFromDB(accountId);

        if (roleId === 2 || roleId === 3) return next();

        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    } catch (err) {
        console.error("verifyModeratorOrAdmin error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};

/**
 * Middleware: chỉ cho phép Admin
 */
exports.verifyAdmin = async (req, res, next) => {
    try {
        const { accountId } = req.user;
        const roleId = await getUserRoleFromDB(accountId);

        if (roleId === 3) return next();

        return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
    } catch (err) {
        console.error("verifyAdmin error:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền" });
    }
};