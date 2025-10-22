const express = require("express");
const router = express.Router();
const { register, login, getProfile, changePassword, resetPassword} = require("../../controllers/authController");
const { verifyToken } = require("../../middleware/authMiddleware");
const {uploadAvatar} = require("../../controllers/imageController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", verifyToken, getProfile);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/change-password", verifyToken, changePassword );
router.post("/auth/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);

module.exports = router;
