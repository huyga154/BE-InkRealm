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
 *               novelId:
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
 *     tags: [Novels]
 *     security:
 *       - bearerAuth: []  # JWT token required
 *     description: >
 *       API cho phép upload ảnh bìa cho một tiểu thuyết.<br>
 *       Flow:<br>
 *       1. Người dùng gửi form-data gồm "novelId" (text) và file "cover" cùng token JWT.<br>
 *       2. Server kiểm tra token hợp lệ.<br>
 *       3. Kiểm tra user có quyền sở hữu novel.<br>
 *       4. Lấy ảnh bìa cũ từ DB.<br>
 *       5. Nếu ảnh cũ là Cloudinary, xóa ảnh cũ.<br>
 *       6. Resize ảnh về 300x400 và upload lên Cloudinary.<br>
 *       7. Cập nhật URL ảnh mới vào DB.<br>
 *       8. Trả về URL ảnh bìa mới.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               novelId:
 *                 type: string
 *                 description: ID của novel cần upload cover (text field trong form-data)
 *                 example: "123"
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cover (file field trong form-data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu novelId"
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Người dùng không phải là chủ sở hữu novel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bạn không có quyền chỉnh sửa novel này"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi upload cover"
 */


/**
 * @swagger
 * /uploader/novel/{novelId}/update/genre:
 *   put:
 *     summary: Cập nhật genres cho một novel
 *     tags:
 *       - Novels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: novelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của novel cần cập nhật genres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               add:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     genreId:
 *                       type: integer
 *                     genreName:
 *                       type: string
 *                 description: Danh sách genres cần thêm
 *               remove:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     genreId:
 *                       type: integer
 *                     genreName:
 *                       type: string
 *                 description: Danh sách genres cần xóa
 *             example:
 *               add:
 *                 - genreId: 1
 *                   genreName: "Lạnh lùng"
 *                 - genreId: 3
 *                   genreName: "Đô thị"
 *               remove:
 *                 - genreId: 5
 *                   genreName: "Hành động"
 *     responses:
 *       200:
 *         description: Cập nhật thành công, trả về danh sách genres hiện tại của novel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update thành công"
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genreId:
 *                         type: integer
 *                       genreName:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Người dùng không phải chủ sở hữu novel
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /novel/genre/all:
 *   get:
 *     summary: Lấy tất cả genre và category
 *     tags:
 *       - Novels
 *     responses:
 *       200:
 *         description: Danh sách thể loại và nhóm theo category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryId:
 *                     type: integer
 *                     example: 1
 *                   categoryName:
 *                     type: string
 *                     example: Fantasy
 *                   categoryDescription:
 *                     type: string
 *                     example: Thể loại giả tưởng
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         genreId:
 *                           type: integer
 *                           example: 1
 *                         genreName:
 *                           type: string
 *                           example: High Fantasy
 *                         genreDescription:
 *                           type: string
 *                           example: Giả tưởng cao
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /novel/genre/search:
 *   post:
 *     summary: Tìm truyện theo nhiều genre (không trả category)
 *     tags:
 *       - Novels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genreList:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Danh sách truyện thuộc các genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   novelId:
 *                     type: integer
 *                   novelTitle:
 *                     type: string
 *                   novelDescription:
 *                     type: string
 *                   author:
 *                     type: string
 *                   novel_img_url:
 *                     type: string
 */



/**
 * @swagger
 * /novel/{novelId}/genre:
 *   get:
 *     summary: Lấy tất cả genre của một truyện theo novelId, nhóm theo category
 *     tags:
 *       - Novels
 *     parameters:
 *       - in: path
 *         name: novelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của truyện
 *     responses:
 *       200:
 *         description: Danh sách genre nhóm theo category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryId:
 *                     type: integer
 *                   categoryName:
 *                     type: string
 *                   categoryDescription:
 *                     type: string
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         genreId:
 *                           type: integer
 *                         genreName:
 *                           type: string
 *                         genreDescription:
 *                           type: string
 */


module.exports = router;