var express = require('express');
var router = express.Router();
const pool = require("../../db");

// 1. Lấy tất cả story
router.post("/all", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM novel_info ORDER BY "novelId" ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/novelId", async (req, res) => {
    try {
        const { storyId } = req.body;

        if (!storyId) {
            return res.status(400).json({ error: "Thiếu id trong request body" });
        }

        const result = await pool.query(
            `SELECT * FROM novel_info WHERE "novelId" = $1`,
            [storyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy novel" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("❌ Lỗi khi lấy novel theo id:", err.message);
        res.status(500).json({ error: "Lỗi server" });
    }
});

module.exports = router;