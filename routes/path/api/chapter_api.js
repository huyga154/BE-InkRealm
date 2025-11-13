var express = require('express');
var router = express.Router();
const { verifyToken, verifyModeratorOrAdmin, verifyNovelOwner} = require("../../middleware/authMiddleware");
const {
    getChapterList,
    postAddNewChapter,
    getChapterText,
    getChapterDetail,
    putUpdateChapterText,
    setChapterPrice, buyChapter, getChaptersByStatusId, getChapterTextById
} = require("../../controllers/chapterController");
const { verifyUploader, resetStatusToDraft, verifyNovelUploader}
    = require("../../middleware/chapterMiddleware");
const {updateNovelGenre} = require("../../controllers/novelGenreController");

router.get("/chapter/list/:novelId", getChapterList);
router.post("/chapter/add",verifyToken,verifyNovelUploader, postAddNewChapter);
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

router.get("/moderator/chapter/list/:chapterStatusId",verifyToken,verifyModeratorOrAdmin, getChaptersByStatusId);
router.get("/moderator/chapter/text/:chapterId",verifyToken,verifyModeratorOrAdmin, getChapterTextById);






module.exports = router;