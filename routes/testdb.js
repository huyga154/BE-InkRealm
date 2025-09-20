var express = require('express');
var router = express.Router();
const pool = require("../db");

/* ✅ API test DB */
router.get('/test-db', async function(req, res) {
    try {
        console.log("---API--- Test DB");
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        console.error("DB Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;