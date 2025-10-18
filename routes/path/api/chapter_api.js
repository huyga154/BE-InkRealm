var express = require('express');
var router = express.Router();
const pool = require("../../../db");
const { verifyToken } = require("../../middleware/authMiddleware");
const {getChapterList, postAddNewChapter, getChapterText, getChapterDetail} = require("../../controllers/chapterController");

router.get("/list", getChapterList);
router.post("/add", postAddNewChapter);
router.get("/text", verifyToken, getChapterText);
router.get("/detail", getChapterDetail);

module.exports = router;