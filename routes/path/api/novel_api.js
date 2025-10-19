var express = require('express');
var router = express.Router();
const {
    postGetAllNovel,
    postGetNovelByNovelId, postCreateNovel
} = require("../../controllers/novelController");
const {verifyToken} = require("../../middleware/authMiddleware");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);
router.post("/uploader/novel/create", verifyToken, postCreateNovel);

module.exports = router;
