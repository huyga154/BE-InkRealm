var express = require('express');
var router = express.Router();
const {
    postGetAllNovel,
    postGetNovelByNovelId
        } = require("../../../controllers/novelController");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);

module.exports = router;
