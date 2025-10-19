var express = require('express');
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: huy123
 *               password:
 *                 type: string
 *                 example: 123456
 *               fullName:
 *                 type: string
 *                 example: Nguyen Minh Huy
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.png
 *               email:
 *                 type: string
 *                 example: vonhantinh01@gmail.com
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Username đã tồn tại
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: huy123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Sai tên đăng nhập hoặc mật khẩu
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân (yêu cầu token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin cá nhân người dùng
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password, gửi password mới qua email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email đã đăng ký
 *                 example: vonhantinh01@gmail.com
 *     responses:
 *       200:
 *         description: Gửi password mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: New password sent to your email
 *       400:
 *         description: Thiếu email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email required
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email not found
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu (cần đăng nhập)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu cũ của người dùng
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới muốn đổi
 *                 example: 123456a
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc thiếu dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Old password incorrect
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 *       404:
 *         description: Người dùng không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

module.exports = router;
