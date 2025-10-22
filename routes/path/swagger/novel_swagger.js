const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Novels
 *   description: API cho truyện
 */

/**
 * @swagger
 * /uploader/novel/create:
 *   post:
 *     summary: Tạo mới novel (yêu cầu đăng nhập)
 *     tags:
 *       - Novels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novelTitle
 *               - author
 *             properties:
 *               novelTitle:
 *                 type: string
 *                 example: "Dị giới phiêu lưu ký"
 *               novelDescription:
 *                 type: string
 *                 example: "Truyện kể về hành trình..."
 *               author:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *     responses:
 *       200:
 *         description: Truyện được tạo thành công
 *       400:
 *         description: Thiếu dữ liệu hoặc truyện đã tồn tại
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Novel:
 *       type: object
 *       properties:
 *         novelId:
 *           type: integer
 *           example: 1
 *         novelTitle:
 *           type: string
 *           example: "Đại Đường Song Long Truyện"
 *         novelDescription:
 *           type: string
 *           example: "Một bộ truyện huyền ảo võ hiệp"
 *         createDate:
 *           type: string
 *           format: date-time
 *           example: "2025-09-24T12:00:00.000Z"
 *         author:
 *           type: string
 *           example: "Huynh Huynh"
 */

/**
 * @swagger
 * /novel/all:
 *   post:
 *     summary: Lấy tất cả novels
 *     tags: [Novels]
 *     responses:
 *       200:
 *         description: Danh sách novels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Novel'
 */

/**
 * @swagger
 * /novel/novelId:
 *   post:
 *     summary: Lấy novel theo ID
 *     tags: [Novels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storyId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Novel được tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Novel'
 *       400:
 *         description: Thiếu storyId
 *       404:
 *         description: Không tìm thấy novel
 */

/**
 * @swagger
 * /uploader/novel/create:
 *   post:
 *     summary: Tạo mới novel (yêu cầu đăng nhập)
 *     tags: [Novels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novelTitle
 *               - author
 *             properties:
 *               novelTitle:
 *                 type: string
 *                 example: "Dị giới phiêu lưu ký"
 *               novelDescription:
 *                 type: string
 *                 example: "Truyện kể về hành trình..."
 *               author:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *     responses:
 *       200:
 *         description: Truyện được tạo thành công
 *       400:
 *         description: Thiếu dữ liệu hoặc truyện đã tồn tại
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /uploader/novel/upload-cover:
 *   post:
 *     summary: Upload ảnh bìa cho novel (cần đăng nhập)
 *     tags: [Novel]
 *     security:
 *       - bearerAuth: []  # JWT token required
 *     description: >
 *       API cho phép upload ảnh bìa cho một tiểu thuyết.<br>
 *       Flow:<br>
 *       1. Người dùng gửi form-data gồm "novelId" và file "cover" cùng token JWT.<br>
 *       2. Server kiểm tra token hợp lệ.<br>
 *       3. Lấy ảnh bìa cũ từ DB.<br>
 *       4. Nếu ảnh cũ là Cloudinary, xóa ảnh cũ.<br>
 *       5. Upload ảnh mới lên Cloudinary.<br>
 *       6. Cập nhật URL ảnh mới vào DB.<br>
 *       7. Trả về URL ảnh bìa mới.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               novelId:
 *                 type: integer
 *                 description: ID của novel cần upload cover
 *                 example: 123
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload cover thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật ảnh bìa thành công"
 *                 coverUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../cover.png"
 *       400:
 *         description: Thiếu novelId hoặc file
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       500:
 *         description: Lỗi server
 */

module.exports = router;