var express = require('express');
var router = express.Router();
const pool = require("../../../config/db");
const { verifyToken } = require("../../../middleware/authMiddleware");
const {
    getChapterList,
    postAddNewChapter,
    getChapterText,
    getChapterDetail,
    putChangeChapterStatus
        } = require("../../../controllers/chapterController");
const { verifyUploader } = require("../../../middleware/chapterMiddleware");

router.get("/list", getChapterList);
router.post("/add", postAddNewChapter);
router.get("/text", verifyToken, getChapterText);
router.get("/detail", getChapterDetail);
router.put(
    "/chapter/:chapterId/status/:chapterStatusId",
    verifyToken,     // kiểm tra JWT
    verifyUploader,  // kiểm tra uploader
    putChangeChapterStatus // cập nhật status
);

module.exports = router;