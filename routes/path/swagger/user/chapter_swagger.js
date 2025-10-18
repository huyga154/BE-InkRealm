var express = require('express');
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chapter
 *   description: API cho truyện
 */



/**
 * @swagger
 * /chapter/list:
 *   get:
 *     summary: Lấy danh sách chapter theo novelId
 *     tags: [Chapter]
 *     parameters:
 *       - in: query
 *         name: novelId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của novel
 *     responses:
 *       200:
 *         description: Danh sách chapter
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
 *                   chapterIndex:
 *                     type: number
 *                   createDate:
 *                     type: string
 *                     format: date-time
 *                   updateDate:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Thiếu novelId
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /chapter/add:
 *   post:
 *     summary: Thêm chapter mới
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novelId
 *               - chapterTitle
 *               - chapterText
 *             properties:
 *               novelId:
 *                 type: integer
 *                 example: 1
 *               chapterIndex:
 *                 type: number
 *                 example: 1
 *               chapterTitle:
 *                 type: string
 *                 example: "Chương 1 - Khởi đầu"
 *               chapterText:
 *                 type: string
 *                 example: "Nội dung chương 1..."
 *               chapterStatusId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Chapter mới được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterId:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /chapter/text:
 *   get:
 *     summary: Lấy nội dung chương (có kiểm tra quyền truy cập)
 *     tags: [Chapter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: integer
 *           example: 1188
 *         required: true
 *         description: ID của chương cần lấy nội dung
 *     responses:
 *       200:
 *         description: Trả về nội dung chương (nếu được phép đọc)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterText:
 *                   type: string
 *                   example: "Đây là nội dung chương 1..."
 *       400:
 *         description: Thiếu chapterId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Thiếu chapterId"
 *       403:
 *         description: Chương cần mua để đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chương này cần mua để đọc"
 *                 price:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Không tìm thấy chương
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /chapter/detail:
 *   get:
 *     summary: Lấy chi tiết một chapter theo chapterId, kèm chapter trước và sau (chỉ chapterId)
 *     tags: [Chapter]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1188
 *         description: ID của chapter cần lấy
 *     responses:
 *       200:
 *         description: Thông tin chi tiết chapter và pre/next
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterId:
 *                   type: integer
 *                 chapterTitle:
 *                   type: string
 *                 chapterIndex:
 *                   type: number
 *                 pre:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *                 next:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *       400:
 *         description: Thiếu chapterId
 *       404:
 *         description: Không tìm thấy chapter
 *       500:
 *         description: Lỗi server
 */

module.exports = router;