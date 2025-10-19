// utils/jwtUtils.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * 🔹 Ký JWT token
 * @param {Object} payload - Dữ liệu muốn lưu (accountId, roleId, ...)
 */
exports.signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

/**
 * 🔹 Xác thực JWT token
 * @param {string} token - JWT string
 * @returns {Object} decoded - Dữ liệu giải mã
 */
exports.verifyJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
