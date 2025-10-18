var express = require('express');
const pool = require("../../db");

exports.postGetAllNovel = async (req,res) => {
    try {
        const result = await pool.query(`SELECT * FROM novel_info ORDER BY "novelId" ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.postGetNovelByNovelId = async (req,res) => {
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
}

exports.postCreateNovel = async (req,res) => {
    try {
        const { novelTitle, novelDescription, author } = req.body;
        const accountId = req.user.id; // lấy từ token

        if (!novelTitle || !author) {
            return res.status(400).json({ error: "Thiếu novelTitle hoặc author" });
        }

        const result = await pool.query(
            `INSERT INTO novel_info ("novelTitle", "novelDescription", "author", "accountId")
       VALUES ($1, $2, $3, $4)
       RETURNING "novelId", "novelTitle", "novelDescription", "author", "accountId", "createDate"`,
            [novelTitle, novelDescription || "", author, accountId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("❌ Lỗi khi tạo novel:", err.message);
        if (err.code === "23505") {
            return res.status(400).json({ error: "Truyện đã tồn tại" });
        }
        res.status(500).json({ error: "Lỗi server" });
    }
}