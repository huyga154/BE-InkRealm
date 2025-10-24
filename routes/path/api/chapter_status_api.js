var express = require('express');
var router = express.Router();
const { verifyToken, verifyModeratorOrAdmin, verifyAdmin} = require("../../middleware/authMiddleware");
const {
    putChangeChapterStatus
    } = require("../../controllers/chapterController");
const { verifyUploader } = require("../../middleware/chapterMiddleware");
const {
    verifyChangeChapterStatus,
    adminAccess,
    uploaderAccess,
    moderatorAccess
    } = require("../../middleware/chapterStatusMiddleware");
const {getChapterStatusList, getUploaderChapterStatus, getModeratorChapterStatus, getAdminChapterStatus} = require("../../controllers/chapterStatusController");


router.put(
    "/uploader/chapter/:chapterId/status/:chapterStatusId",
    verifyToken,               // kiểm tra JWT
    verifyUploader,            // kiểm tra uploader
    verifyChangeChapterStatus, // kiểm tra quyền đổi status
    putChangeChapterStatus     // cập nhật status
);

router.put("/moderator/chapter/:chapterId/status/:chapterStatusId",
    verifyToken,
    verifyModeratorOrAdmin,
    verifyChangeChapterStatus,
    putChangeChapterStatus
    );

router.put("/admin/chapter/:chapterId/status/:chapterStatusId",
    verifyToken,
    verifyAdmin,
    verifyChangeChapterStatus,
    putChangeChapterStatus
);

router.get('/uploader/chapter-status', verifyToken, getUploaderChapterStatus);
router.get('/moderator/chapter-status', verifyToken, verifyModeratorOrAdmin, getModeratorChapterStatus);
router.get('/admin/chapter-status', verifyToken, verifyAdmin, getAdminChapterStatus);

module.exports = router;