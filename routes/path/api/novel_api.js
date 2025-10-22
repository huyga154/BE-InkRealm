var express = require('express');
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
    postGetAllNovel,
    postGetNovelByNovelId, postCreateNovel
} = require("../../controllers/novelController");
const {verifyToken} = require("../../middleware/authMiddleware");
const {uploadCover} = require("../../controllers/imageController");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);
router.post("/uploader/novel/create", verifyToken, postCreateNovel);
router.post("uploader/novel/upload-cover", verifyToken, upload.single("cover"), uploadCover);

module.exports = router;
