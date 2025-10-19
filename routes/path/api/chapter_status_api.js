var express = require('express');
var router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
    putChangeChapterStatus
    } = require("../../controllers/chapterController");
const { verifyUploader } = require("../../middleware/chapterMiddleware");
const {verifyChangeChapterStatus} = require("../../middleware/chapterStatusMiddleware");


router.put(
    "/uploader/chapter/:chapterId/status/:chapterStatusId",
    verifyToken,     // kiểm tra JWT
    verifyUploader,  // kiểm tra uploader
    verifyChangeChapterStatus, // kiểm tra việc đổi status phù hợp role hay không
    putChangeChapterStatus // cập nhật status
);

module.exports = router;