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
 * /chapter/list/{novelId}:
 *   get:
 *     summary: Lấy danh sách chapter theo novelId
 *     description: Trả về danh sách các chapter của một novel dựa vào path parameter. Bao gồm ID chapter, tiêu đề, thứ tự, trạng thái, ngày tạo và ngày cập nhật.
 *     tags: [Chapter]
 *     parameters:
 *       - in: path
 *         name: novelId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của novel muốn lấy chapter
 *     responses:
 *       200:
 *         description: Danh sách chapter thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 novelId:
 *                   type: integer
 *                   example: 1
 *                 chapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chapterId:
 *                         type: integer
 *                       chapterTitle:
 *                         type: string
 *                       chapterIndex:
 *                         type: number
 *                       chapterStatusId:
 *                         type: integer
 *                       createDate:
 *                         type: string
 *                         format: date-time
 *                       updateDate:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Thiếu hoặc sai novelId
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



/**
 * @swagger
 * /chapter/{chapterId}/text/update:
 *   put:
 *     tags:
 *       - Chapter
 *     summary: Cập nhật nội dung chương
 *     description: Người đăng chương cập nhật nội dung. Chương sẽ tự động chuyển trạng thái sang 'draft'.
 *     parameters:
 *       - name: chapterId
 *         in: path
 *         required: true
 *         description: ID của chương cần cập nhật
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterText:
 *                 type: string
 *                 description: Nội dung mới của chương
 *                 example: "Nội dung chương đã được cập nhật..."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật nội dung chương thành công"
 *                 chapter:
 *                   type: object
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *                       example: 123
 *                     chapterTitle:
 *                       type: string
 *                       example: "Chương 1: Bắt đầu"
 *                     chapterText:
 *                       type: string
 *                       example: "Nội dung chương đã được cập nhật..."
 *                     updateDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-20T12:34:56.789Z"
 *       400:
 *         description: Thiếu hoặc sai định dạng đầu vào
 *       401:
 *         description: Không xác thực được người dùng
 *       403:
 *         description: Người dùng không phải uploader
 *       404:
 *         description: Không tìm thấy chương
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /uploader/{chapterId}/set-price:
 *   put:
 *     tags:
 *       - Chapter
 *     summary: Đặt giá cho chương
 *     description: Người đăng chương đặt giá tiền cho chương. Chỉ uploader mới được thực hiện.
 *     parameters:
 *       - name: chapterId
 *         in: path
 *         required: true
 *         description: ID của chương cần đặt giá
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: integer
 *                 description: Giá của chương (coin)
 *                 example: 50
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đặt giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật giá chương thành công"
 *                 price:
 *                   type: integer
 *                   example: 50
 *       400:
 *         description: Giá chương không hợp lệ
 *       401:
 *         description: Không xác thực được người dùng
 *       403:
 *         description: Người dùng không phải uploader
 *       404:
 *         description: Không tìm thấy chương
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /chapter/{chapterId}/buy:
 *   post:
 *     tags:
 *       - Chapter
 *     summary: Mua một chương truyện
 *     description: Người dùng mua một chương. Sử dụng token để xác thực. Ghi nhận giao dịch và lịch sử mua.
 *     parameters:
 *       - name: chapterId
 *         in: path
 *         required: true
 *         description: ID của chương cần mua
 *         schema:
 *           type: integer
 *           example: 123
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mua chương thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mua chương thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     chapterId:
 *                       type: integer
 *                       example: 123
 *                     price:
 *                       type: integer
 *                       example: 50
 *                     buyerId:
 *                       type: integer
 *                       example: 10
 *                     uploaderId:
 *                       type: integer
 *                       example: 5
 *                     transactionId:
 *                       type: integer
 *                       example: 789
 *       400:
 *         description: Lỗi do input hoặc điều kiện mua (số dư không đủ, đã mua, miễn phí, tự mua)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Số dư không đủ"
 *       401:
 *         description: Không xác thực được người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không xác thực được tài khoản"
 *       404:
 *         description: Chương hoặc tài khoản không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi mua chương"
 */


/**
 * @swagger
 * /moderator/chapter/list/{chapterStatusId}:
 *   get:
 *     summary: Lấy danh sách chapter theo chapterStatusId
 *     description: Lấy tất cả chapter có trạng thái nhất định, không kiểm tra role
 *     tags:
 *       - Chapter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapterStatusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của trạng thái chapter
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách chapter
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
 *                     type: integer
 *                   chapterStatusId:
 *                     type: integer
 *                   chapterStatusCode:
 *                     type: string
 *                   chapterStatusDescription:
 *                     type: string
 *                   novelId:
 *                     type: integer
 *                   novelTitle:
 *                     type: string
 *       400:
 *         description: Thiếu hoặc không hợp lệ chapterStatusId
 *       500:
 *         description: Lỗi server khi lấy danh sách chapter
 */


/**
 * @swagger
 * /moderator/chapter/text/{chapterId}:
 *   get:
 *     summary: Lấy nội dung chapter theo chapterId
 *     description: Lấy text của chapter, cần quyền moderator hoặc admin
 *     tags:
 *       - Chapter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chapter
 *     responses:
 *       200:
 *         description: Thành công, trả về nội dung chapter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapterId:
 *                   type: integer
 *                 chapterTitle:
 *                   type: string
 *                 chapterText:
 *                   type: string
 *                 novelId:
 *                   type: integer
 *       400:
 *         description: Thiếu hoặc không hợp lệ chapterId
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Chapter không tồn tại
 *       500:
 *         description: Lỗi server khi lấy nội dung chapter
 */


module.exports = router;