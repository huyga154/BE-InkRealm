var express = require('express');
var router = express.Router();
const pool = require("../../../config/db");
const { verifyToken } = require("../../../middleware/authMiddleware");
const {
    postGetAllNovel,
    postGetNovelByNovelId,
    postCreateNovel
        } = require("../../../controllers/novelController");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);
router.post("/uploader/novel/create", verifyToken, postCreateNovel);

module.exports = router;
