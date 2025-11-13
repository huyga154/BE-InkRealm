const express = require("express");
const {getTransactionHistory} = require("../../controllers/transactionHistoryController");
const {verifyToken} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/user/transaction",verifyToken,getTransactionHistory);

module.exports = router;