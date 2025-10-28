const pool = require('../config/db');

// 🧩 Tạo tài khoản (Admin)
exports.createAccount = async ({ username, password, fullName, email, avatar, roleId }) => {
    const result = await pool.query(
        `INSERT INTO account ("username", "password", "fullName", "email", "avatar", "roleId")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
        [username, password, fullName, email, avatar, roleId]
    );
    return result.rows[0];
};

// ✏️ Cập nhật tài khoản
exports.updateAccount = async (accountId, { username, password, fullName, email, avatar, roleId }) => {
    const result = await pool.query(
        `UPDATE account
     SET "username" = COALESCE($1, "username"),
         "password" = COALESCE($2, "password"),
         "fullName" = COALESCE($3, "fullName"),
         "email" = COALESCE($4, "email"),
         "avatar" = COALESCE($5, "avatar"),
         "roleId" = COALESCE($6, "roleId")
     WHERE "accountId" = $7
     RETURNING *`,
        [username, password, fullName, email, avatar, roleId, accountId]
    );
    return result.rows[0];
};

// ❌ Xóa tài khoản
exports.deleteAccount = async (accountId) => {
    await pool.query('DELETE FROM account WHERE "accountId" = $1', [accountId]);
};
