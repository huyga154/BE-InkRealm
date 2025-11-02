var express = require('express');
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const pool = require("../../config/db");


const {
    postGetAllNovel,
    postGetNovelByNovelId, postCreateNovel
} = require("../../controllers/novelController");
const {verifyToken, verifyNovelOwner} = require("../../middleware/authMiddleware");
const {uploadCover} = require("../../controllers/imageController");
const {checkNovelOwner} = require("../../middleware/novelMiddleware");
const {updateNovelGenre} = require("../../controllers/novelGenreController");

router.post("/novel/all", postGetAllNovel);
router.post("/novel/novelId", postGetNovelByNovelId);
router.post("/uploader/novel/create", verifyToken, postCreateNovel);
router.post("/uploader/novel/upload-cover", verifyToken, upload.single("cover"),checkNovelOwner, uploadCover);

// Update genres for a novel
router.put(
    "/uploader/novel/:novelId/update/genre",
    verifyToken,
    verifyNovelOwner,
    updateNovelGenre
);

// GET /genre/all
router.get('/novel/genre/all', async (req, res) => {
    try {
        const query = `
            SELECT 
                g.id AS "genreId",
                g.name AS "genreName",
                g.description AS "genreDescription",
                gc.id AS "categoryId",
                gc.name AS "categoryName",
                gc.description AS "categoryDescription"
            FROM genre g
            JOIN genre_category gc ON g.category_id = gc.id
            ORDER BY gc.name, g.name
        `;

        const result = await pool.query(query);

        // Nhóm theo category nếu muốn
        const categories = {};
        result.rows.forEach(row => {
            if (!categories[row.categoryId]) {
                categories[row.categoryId] = {
                    categoryId: row.categoryId,
                    categoryName: row.categoryName,
                    categoryDescription: row.categoryDescription,
                    genres: []
                };
            }
            categories[row.categoryId].genres.push({
                genreId: row.genreId,
                genreName: row.genreName,
                genreDescription: row.genreDescription
            });
        });

        res.json(Object.values(categories));
    } catch (err) {
        console.error('Error fetching genres:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});



router.post('/novel/genre/search', async (req, res) => {
    const { genreList } = req.body;

    if (!genreList || !Array.isArray(genreList) || genreList.length === 0) {
        return res.status(400).json({ message: "genreList không hợp lệ" });
    }

    try {
        const query = `
            SELECT DISTINCT ni."novelId",
                            ni."novelTitle",
                            ni."novelDescription",
                            ni."author",
                            ni."novel_img_url"
            FROM novel_genre ng
            JOIN "novel_info" ni ON ng."novelId" = ni."novelId"
            WHERE ng."genreId" = ANY($1)
            ORDER BY ni."novelTitle"
        `;

        const result = await pool.query(query, [genreList]);

        const novels = result.rows.map(row => ({
            novelId: row.novelId,
            novelTitle: row.novelTitle,
            novelDescription: row.novelDescription,
            author: row.author,
            novel_img_url: row.novel_img_url
        }));

        res.json(novels);
    } catch (err) {
        console.error('Error fetching novels by genres:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


router.get('/novel/:novelId/genre', async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) return res.status(400).json({ message: "Thiếu novelId" });

    try {
        const query = `
            SELECT 
                g.id AS "genreId",
                g.name AS "genreName",
                g.description AS "genreDescription",
                gc.id AS "categoryId",
                gc.name AS "categoryName",
                gc.description AS "categoryDescription"
            FROM novel_genre ng
            JOIN genre g ON ng."genreId" = g.id
            JOIN genre_category gc ON g.category_id = gc.id
            WHERE ng."novelId" = $1
            ORDER BY gc.name, g.name
        `;

        const result = await pool.query(query, [novelId]);

        const categories = {};
        result.rows.forEach(row => {
            if (!categories[row.categoryId]) {
                categories[row.categoryId] = {
                    categoryId: row.categoryId,
                    categoryName: row.categoryName,
                    categoryDescription: row.categoryDescription,
                    genres: []
                };
            }
            categories[row.categoryId].genres.push({
                genreId: row.genreId,
                genreName: row.genreName,
                genreDescription: row.genreDescription
            });
        });

        res.json(Object.values(categories));
    } catch (err) {
        console.error('Error fetching novel genres:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});



module.exports = router;
