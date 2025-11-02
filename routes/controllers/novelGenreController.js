const pool = require("../config/db");


exports.updateNovelGenre = async (req, res) => {
    const { novelId } = req.params;
    const { add = [], remove = [] } = req.body;

    try {
        // 1. Add genres (ON CONFLICT DO NOTHING tránh duplicate)
        if (add.length > 0) {
            const addValues = add.map((g) => `(${novelId}, ${g.genreId})`).join(",");
            await pool.query(
                `INSERT INTO novel_genre("novelId","genreId") VALUES ${addValues} ON CONFLICT DO NOTHING`
            );
        }

        // 2. Remove genres
        if (remove.length > 0) {
            const removeIds = remove.map((g) => g.genreId).join(",");
            await pool.query(
                `DELETE FROM novel_genre WHERE "novelId" = $1 AND "genreId" IN (${removeIds})`,
                [novelId]
            );
        }

        // 3. Lấy lại danh sách genre sau khi update
        const result = await pool.query(
            `SELECT ng."genreId", g."name" as "genreName", g."description"
         FROM novel_genre ng
         JOIN genre g ON ng."genreId" = g."id"
         WHERE ng."novelId" = $1`,
            [novelId]
        );

        res.json({ message: "Update thành công", genres: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
    }
}


