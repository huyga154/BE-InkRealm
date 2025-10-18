/**
 * @swagger
 * tags:
 *   name: Novels
 *   description: API cho truyện
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
 * /novel/create:
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