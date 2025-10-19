const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ChapterStatus
 *   description: API quản lý trạng thái chapter
 */

/**
 * @swagger
 * /uploader/chapter/{chapterId}/status/{chapterStatusId}:
 *   put:
 *     summary: Uploader đổi trạng thái chapter
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Uploader của truyện có thể đổi trạng thái chương trong các trạng thái hợp lệ.<br>
 *       Flow:<br>
 *         1. Xác thực JWT (verifyToken)<br>
 *         2. Kiểm tra user có phải uploader của novel chứa chapter này (verifyUploader)<br>
 *         3. Kiểm tra việc đổi trạng thái có hợp lệ với role (verifyChangeChapterStatus)<br>
 *         4. Nếu hợp lệ, cập nhật trạng thái trong DB (putChangeChapterStatus)
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID của chapter cần đổi trạng thái
 *       - in: path
 *         name: chapterStatusId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *         description: ID trạng thái mới của chapter
 *     responses:
 *       200:
 *         description: Đổi trạng thái thành công
 *       400:
 *         description: Tham số không hợp lệ hoặc trạng thái không được phép đổi
 *       403:
 *         description: User không có quyền thay đổi chapter
 *       404:
 *         description: Chapter không tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /moderator/chapter/{chapterId}/status/{chapterStatusId}:
 *   put:
 *     summary: Moderator hoặc Admin đổi trạng thái chapter
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Moderator hoặc Admin có thể đổi trạng thái chapter trong các trạng thái được phép.<br>
 *       Flow:<br>
 *         1. Xác thực JWT (verifyToken)<br>
 *         2. Kiểm tra role là Moderator hoặc Admin (verifyModeratorOrAdmin)<br>
 *         3. Kiểm tra việc đổi trạng thái có hợp lệ (verifyChangeChapterStatus)<br>
 *         4. Nếu hợp lệ, cập nhật trạng thái (putChangeChapterStatus)
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID của chapter cần đổi trạng thái
 *       - in: path
 *         name: chapterStatusId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *         description: ID trạng thái mới của chapter
 *     responses:
 *       200:
 *         description: Đổi trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ với role
 *       403:
 *         description: Không đủ quyền (chỉ moderator/admin)
 *       404:
 *         description: Chapter không tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /admin/chapter/{chapterId}/status/{chapterStatusId}:
 *   put:
 *     summary: Admin đổi trạng thái chapter
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Admin có quyền thay đổi bất kỳ trạng thái nào của chapter.<br>
 *       Flow:<br>
 *         1. Xác thực JWT (verifyToken)<br>
 *         2. Kiểm tra role là Admin (verifyAdmin)<br>
 *         3. Kiểm tra việc đổi trạng thái có hợp lệ (verifyChangeChapterStatus)<br>
 *         4. Cập nhật trạng thái nếu hợp lệ (putChangeChapterStatus)
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID của chapter cần đổi trạng thái
 *       - in: path
 *         name: chapterStatusId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 7
 *         description: ID trạng thái mới của chapter
 *     responses:
 *       200:
 *         description: Đổi trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ (ít khả năng xảy ra với admin)
 *       403:
 *         description: Không đủ quyền (chỉ admin)
 *       404:
 *         description: Chapter không tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /uploader/chapter-status:
 *   get:
 *     summary: Lấy danh sách chapter status mà uploader có quyền truy cập
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       API này trả về danh sách các chapter thuộc những novel mà người dùng là uploader.<br>
 *       Middleware `uploaderAccess` đảm bảo người dùng chỉ lấy được các chapter mà họ sở hữu.<br>
 *       Controller chỉ chịu trách nhiệm truy vấn dữ liệu dựa trên filter được middleware gán.<br>
 *       Flow:<br>
 *       1. Xác thực token bằng `verifyToken`.<br>
 *       2. Middleware `uploaderAccess` xác định filter các chapter.<br>
 *       3. Controller `getChapterStatusList` trả về danh sách chapter.
 *     responses:
 *       200:
 *         description: Danh sách chapter hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chapterId:
 *                     type: integer
 *                   chapterTitle:
 *                     type: string
 *                   chapterStatusId:
 *                     type: integer
 *                   chapterStatusCode:
 *                     type: string
 *                   chapterStatusDescription:
 *                     type: string
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /moderator/chapter-status:
 *   get:
 *     summary: Lấy danh sách chapter status theo quyền moderator
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       API này trả về danh sách các chapter mà moderator có quyền xem.<br>
 *       Middleware `verifyModeratorOrAdmin` đảm bảo người dùng là moderator hoặc admin.<br>
 *       Middleware `moderatorAccess` áp dụng filter trạng thái chapter mà moderator có thể xem.<br>
 *       Flow:<br>
 *       1. Xác thực token bằng `verifyToken`.<br>
 *       2. Kiểm tra quyền bằng `verifyModeratorOrAdmin`.<br>
 *       3. Middleware `moderatorAccess` gán filter chapter hợp lệ.<br>
 *       4. Controller `getChapterStatusList` truy vấn và trả về danh sách chapter.
 *     responses:
 *       200:
 *         description: Danh sách chapter hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chapterId:
 *                     type: integer
 *                   chapterTitle:
 *                     type: string
 *                   chapterStatusId:
 *                     type: integer
 *                   chapterStatusCode:
 *                     type: string
 *                   chapterStatusDescription:
 *                     type: string
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Người dùng không có quyền moderator
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /admin/chapter-status:
 *   get:
 *     summary: Lấy danh sách chapter status theo quyền admin
 *     tags: [ChapterStatus]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       API này trả về danh sách tất cả chapter.<br>
 *       Middleware `verifyAdmin` đảm bảo người dùng là admin.<br>
 *       Middleware `adminAccess` không áp dụng filter, controller lấy tất cả chapter.<br>
 *       Flow:<br>
 *       1. Xác thực token bằng `verifyToken`.<br>
 *       2. Kiểm tra quyền admin bằng `verifyAdmin`.<br>
 *       3. Middleware `adminAccess` gán filter trống.<br>
 *       4. Controller `getChapterStatusList` trả về tất cả chapter.
 *     responses:
 *       200:
 *         description: Danh sách tất cả chapter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chapterId:
 *                     type: integer
 *                   chapterTitle:
 *                     type: string
 *                   chapterStatusId:
 *                     type: integer
 *                   chapterStatusCode:
 *                     type: string
 *                   chapterStatusDescription:
 *                     type: string
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi server
 */




module.exports = router;
