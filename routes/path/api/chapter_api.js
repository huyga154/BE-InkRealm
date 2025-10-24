var express = require('express');
var router = express.Router();
const { verifyToken, verifyModeratorOrAdmin} = require("../../middleware/authMiddleware");
const {
    getChapterList,
    postAddNewChapter,
    getChapterText,
    getChapterDetail,
    putUpdateChapterText,
    setChapterPrice, buyChapter, getChaptersByStatusId, getChapterTextById
} = require("../../controllers/chapterController");
const { verifyUploader, resetStatusToDraft}
    = require("../../middleware/chapterMiddleware");

router.get("/chapter/list/:novelId", getChapterList);
router.post("/chapter/add", postAddNewChapter);
router.get("/chapter/text", verifyToken, getChapterText);
router.get("/chapter/detail", getChapterDetail);

router.put("/chapter/:chapterId/text/update",
    verifyToken,
    verifyUploader,
    resetStatusToDraft,
    putUpdateChapterText);

router.put("/uploader/:chapterId/set-price",
    verifyToken,
    verifyUploader,
    setChapterPrice);

router.post(
    "/chapter/:chapterId/buy",
    verifyToken,
    buyChapter
);

router.get("/chapter/list/:chapterStatusId", getChaptersByStatusId);
router.get("/moderator/chapter/text/:chapterId",verifyModeratorOrAdmin, getChapterTextById);


module.exports = router;