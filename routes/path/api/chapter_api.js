var express = require('express');
var router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
    getChapterList,
    postAddNewChapter,
    getChapterText,
    getChapterDetail, putUpdateChapterText
} = require("../../controllers/chapterController");
const { verifyUploader, resetStatusToDraft} = require("../../middleware/chapterMiddleware");

router.get("/chapter/list/:novelId", getChapterList);
router.post("/chapter/add", postAddNewChapter);
router.get("/chapter/text", verifyToken, getChapterText);
router.get("/chapter/detail", getChapterDetail);
router.put("/chapter/text/update",
    verifyToken,
    verifyUploader,
    resetStatusToDraft,
    putUpdateChapterText);

module.exports = router;