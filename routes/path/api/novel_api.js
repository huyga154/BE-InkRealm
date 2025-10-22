var express = require('express');
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


const {
    postGetAllNovel,
    postGetNovelByNovelId, postCreateNovel
} = require("../../controllers/novelController");
const {verifyToken} = require("../../middleware/authMiddleware");
const {uploadCover} = require("../../controllers/imageController");
const {checkNovelOwner} = require("../../middleware/novelMiddleware");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);
router.post("/uploader/novel/create", verifyToken, postCreateNovel);
router.post("/uploader/novel/upload-cover", verifyToken, upload.single("cover"),checkNovelOwner, uploadCover);

module.exports = router;
