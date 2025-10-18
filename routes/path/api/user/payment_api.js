const express = require("express");
const crypto = require("crypto");
const db = require("../../../config/db");
const {postWebHookCasso, postCreatePaymentLink} = require("../../../controllers/paymentController")
require("dotenv").config();

const router = express.Router();

router.post("/webhook", postWebHookCasso);
router.post("/create-payment-link", postCreatePaymentLink);

module.exports = router;
