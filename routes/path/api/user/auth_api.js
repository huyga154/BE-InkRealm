const express = require("express");
const router = express.Router();
const pool = require("../../../config/db");
const { register, login, getProfile, changePassword, resetPassword} = require("../../../controllers/authController");
const { verifyToken } = require("../../../middleware/authMiddleware");
const {log} = require("debug");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/reset-password", resetPassword);
router.post("/change-password", verifyToken, changePassword );

module.exports = router;
