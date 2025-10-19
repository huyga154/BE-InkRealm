const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {log} = require("debug");
const sendMail = require("../utils/sendEmail");
require("dotenv").config();

// 🔹 Helper: Tạo JWT
const signToken = ({accountId,roleId}) => {
    return jwt.sign({ accountId,roleId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// 🔹 Đăng ký tài khoản mới
exports.register = async (req, res) => {
    const { username, password, email, fullName, avatar } = req.body;

    try {
        // Kiểm tra trùng username
        const userExist = await pool.query(
            'SELECT * FROM "account" WHERE "username" = $1',
            [username]
        );

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }

        const emailExist = await pool.query(
            'SELECT * FROM "account" WHERE "email" = $1',
            [email]
        );

        if (emailExist.rows.length > 0) {
            return res.status(400).json({ message: "Email đã được dùng" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const result = await pool.query(
            `INSERT INTO "account" ("username", "password", "fullName", "avatar" , "email") 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING "accountId", "username", "fullName", "avatar","email"`,
            [username, hashedPassword, fullName || null, avatar || "" , email]
        );

        const user = result.rows[0];
        const token = signToken(user.accountId);

        res.status(201).json({
            message: "Đăng ký thành công",
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server : " + err  });
    }
};

// 🔹 Đăng nhập
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM "account" WHERE "username" = $1',
            [username]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const token = signToken(user.accountId , user.roleId);

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                accountId: user.accountId,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                coin: user.coin,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 🔹 Lấy thông tin cá nhân (sau khi verifyToken)
exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT "accountId", "username", "fullName", "avatar", "coin" FROM "account" WHERE "accountId" = $1',
            [req.user.accountId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return res.status(400).json({ error: "Missing old or new password" });

        const accountId = req.user.accountId;

        const result = await pool.query(
            'SELECT "accountId", "password" FROM "account" WHERE "accountId"=$1',
            [accountId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "User not found" });

        const user = result.rows[0];
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid)
            return res.status(400).json({ error: "Old password incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        const updateResult = await pool.query(
            'UPDATE "account" SET "password"=$1 WHERE "accountId"=$2 RETURNING "accountId"',
            [hashed, accountId]
        );

        if (updateResult.rowCount === 0)
            return res.status(400).json({ error: "Password not updated" });

        res.json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.resetPassword = async(req,res) => {

    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });

        const result = await pool.query('SELECT * FROM "account" WHERE "email"=$1', [email]);
        if (!result.rows[0]) return res.status(404).json({ error: "Email not found" });

        // generate password mới
        const newPassword = Math.random().toString(36).slice(-8);
        const hashed = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE "account" SET "password"=$1 WHERE "email"=$2', [hashed, email]);

        try {
            await sendMail(email, "Your new password", `Your new password: ${newPassword}`);
        } catch (mailErr) {
            console.error("Send mail error:", mailErr);
            return res.status(500).json({ error: "Cannot send email" });
        }

        res.json({ success: true, message: "New password sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }

}

