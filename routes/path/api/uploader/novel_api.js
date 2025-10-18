var express = require('express');
var router = express.Router();
const pool = require("../../../config/db");
const { verifyToken } = require("../../../middleware/authMiddleware");
const {
    postCreateNovel
} = require("../../../controllers/novelController");

router.post("/uploader/novel/create", verifyToken, postCreateNovel);

module.exports = router;
