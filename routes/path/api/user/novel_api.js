var express = require('express');
var router = express.Router();
const pool = require("../../../../db");
const { verifyToken } = require("../../../middleware/authMiddleware");
const {
    postGetAllNovel,
    postGetNovelByNovelId,
    postCreateNovel
        } = require("../../../controllers/novelController");

router.post("/all", postGetAllNovel);
router.post("/novelId", postGetNovelByNovelId);
router.post("/create", verifyToken, postCreateNovel);

module.exports = router;
