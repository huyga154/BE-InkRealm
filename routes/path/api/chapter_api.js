var express = require('express');
var router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
    getChapterList,
    postAddNewChapter,
    getChapterText,
    getChapterDetail,
    putChangeChapterStatus
        } = require("../../controllers/chapterController");
const { verifyUploader } = require("../../middleware/chapterMiddleware");

router.get("/list", getChapterList);
router.post("/add", postAddNewChapter);
router.get("/text", verifyToken, getChapterText);
router.get("/detail", getChapterDetail);

module.exports = router;