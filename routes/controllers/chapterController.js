const pool = require("../config/db");
const chapterService = require("../service/chapterService");
require("dotenv").config();

exports.getChapterList = async (req, res) => {
    try {
        const { novelId } = req.params; // lấy từ path param /chapter/list/:novelId

        if (!novelId || isNaN(parseInt(novelId))) {
            return res.status(400).json({ error: "Thiếu hoặc không hợp lệ novelId" });
        }

        const result = await pool.query(
            `SELECT "chapterId", "chapterTitle", "chapterIndex", "createDate", "updateDate", "chapterStatusId","price"
             FROM "chapter"
             WHERE "novelId" = $1
             ORDER BY "chapterIndex" ASC`,
            [novelId]
        );

        res.status(200).json({
            success: true,
            novelId: Number(novelId),
            chapters: result.rows
        });
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách chapter theo novelId:", err.message);
        res.status(500).json({ error: "Không lấy được danh sách chapter" });
    }
};

exports.postAddNewChapter = async (req, res) => {
    try {
        const { novelId, chapterIndex, chapterTitle, chapterText } = req.body;

        if (!novelId || !chapterTitle || !chapterText || chapterIndex == null) {
            return res.status(400).json({ error: "Thiếu param" });
        }

        // 🔹 Kiểm tra xem index đã tồn tại trong truyện này chưa
        const checkIndex = await pool.query(
            `SELECT 1 FROM chapter WHERE "novelId"=$1 AND "chapterIndex"=$2`,
            [novelId, chapterIndex]
        );

        if (checkIndex.rowCount > 0) {
            return res.status(400).json({
                error: `Index số ${chapterIndex} đã tồn tại trong truyện này`
            });
        }

        const result = await pool.query(
            `INSERT INTO chapter 
             ("novelId", "chapterIndex", "chapterTitle", "chapterText", "chapterStatusId", "createDate")
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING "chapterId"`,
            [novelId, chapterIndex, chapterTitle, chapterText, 2] // 2 = draft/active status
        );

        res.status(201).json({
            chapterId: result.rows[0].chapterid,
            message: "Thêm chapter thành công",
        });
    } catch (err) {
        console.error("❌ Lỗi khi thêm chapter:", err.message);
        res.status(500).json({ error: "Không thể thêm chapter mới" });
    }
};

exports.getChapterText = async (req, res) => {
    try {
        const { chapterId } = req.query;
        const accountId = req.user?.accountId; // lấy từ token

        if (!chapterId) {
            return res.status(400).json({ error: "Thiếu chapterId" });
        }

        // 1️⃣ Lấy thông tin chương (bao gồm price, novelId và uploader)
        const chapterResult = await pool.query(
            `SELECT c."chapterId", c."novelId", c."chapterText", c."price",
                    n."accountId" AS "uploaderId"
             FROM "chapter" c
                      JOIN "novel_info" n ON c."novelId" = n."novelId"
             WHERE c."chapterId" = $1`,
            [chapterId]
        );

        if (chapterResult.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy chapter" });
        }

        const chapter = chapterResult.rows[0];

        // 2️⃣ Nếu miễn phí → cho đọc luôn
        if (chapter.price === 0) {
            return res.json({ chapterText: chapter.chapterText });
        }

        // 3️⃣ Nếu người đọc là uploader → cho đọc luôn
        if (chapter.uploaderId === accountId) {
            return res.json({ chapterText: chapter.chapterText });
        }

        // 4️⃣ Kiểm tra user đã mua chương hoặc mua truyện chưa
        const [purchaseChapter, purchaseNovel] = await Promise.all([
            pool.query(
                `SELECT 1 FROM "chapter_purchase"
                 WHERE "accountId" = $1 AND "chapterId" = $2`,
                [accountId, chapterId]
            ),
            pool.query(
                `SELECT 1 FROM "novel_purchase"
                 WHERE "accountId" = $1 AND "novelId" = $2`,
                [accountId, chapter.novelId]
            ),
        ]);

        const hasPurchasedChapter = purchaseChapter.rows.length > 0;
        const hasPurchasedNovel = purchaseNovel.rows.length > 0;

        // 5️⃣ Nếu đã mua → cho đọc
        if (hasPurchasedChapter || hasPurchasedNovel) {
            return res.json({ chapterText: chapter.chapterText });
        }

        // 6️⃣ Nếu chưa mua → trả về thông báo và giá
        return res.status(403).json({
            error: "Chương này cần mua để đọc",
            price: chapter.price,
        });

    } catch (err) {
        console.error("❌ Lỗi khi lấy data chapter:", err.message);
        res.status(500).json({ error: "Không thể lấy text của chapter" });
    }
};

exports.getChapterDetail = async (req,res) => {
    try {
        const { chapterId } = req.query;

        if (!chapterId) {
            return res.status(400).json({ error: "Thiếu chapterId" });
        }

        // Lấy thông tin chapter hiện tại
        const current = await pool.query(
            `SELECT "chapterId", "chapterTitle", "chapterIndex", "novelId"
             FROM "chapter"
             WHERE "chapterId" = $1`,
            [chapterId]
        );

        if (current.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy chapter" });
        }

        const chapter = current.rows[0];

        // Chương trước trong cùng novel
        const pre = await pool.query(
            `SELECT "chapterId"
             FROM "chapter"
             WHERE "novelId" = $1
             AND "chapterIndex" < $2
             ORDER BY "chapterIndex" DESC
             LIMIT 1`,
            [chapter.novelId, chapter.chapterIndex]
        );

        // Chương sau trong cùng novel
        const next = await pool.query(
            `SELECT "chapterId"
             FROM "chapter"
             WHERE "novelId" = $1
             AND "chapterIndex" > $2
             ORDER BY "chapterIndex" ASC
             LIMIT 1`,
            [chapter.novelId, chapter.chapterIndex]
        );

        res.json({
            chapterId: chapter.chapterId,
            chapterTitle: chapter.chapterTitle,
            chapterIndex: chapter.chapterIndex,
            pre: pre.rows[0] || null,
            next: next.rows[0] || null
        });
    } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết chapter:", err.message);
        res.status(500).json({ error: "Không thể lấy chi tiết chapter" });
    }
}

exports.putChangeChapterStatus = async (req, res) => {
    try {
        const { chapterId, chapterStatusId } = req.params;

        // Kiểm tra param hợp lệ
        if (!chapterId || isNaN(parseInt(chapterId))) {
            return res.status(400).json({ message: "chapterId không hợp lệ" });
        }
        if (!chapterStatusId || isNaN(parseInt(chapterStatusId))) {
            return res.status(400).json({ message: "chapterStatusId không hợp lệ" });
        }

        // Cập nhật trạng thái
        const result = await pool.query(
            `UPDATE "chapter"
             SET "chapterStatusId" = $1, "updateDate" = NOW()
             WHERE "chapterId" = $2
             RETURNING "chapterId", "chapterStatusId"`,
            [chapterStatusId, chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Chương không tồn tại" });
        }

        res.json({
            success: true,
            message: "Trạng thái chapter đã được cập nhật",
            chapter: result.rows[0]
        });

    } catch (err) {
        console.error("putChangeChapterStatus error:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái chapter" });
    }
};

exports.putUpdateChapterText = async (req, res) => {
    try {
        const { chapterId} = req.params;
        const { chapterText } = req.body;

        // ✅ Kiểm tra đầu vào
        if (!chapterId || isNaN(chapterId)) {
            return res.status(400).json({ message: "chapterId không hợp lệ" });
        }

        if (!chapterText || typeof chapterText !== "string" || chapterText.trim() === "") {
            return res.status(400).json({ message: "Thiếu hoặc sai định dạng nội dung chương (chapterText)" });
        }

        // ✅ Cập nhật nội dung chương
        const result = await pool.query(
            `UPDATE "chapter"
             SET "chapterText" = $1,
                 "updateDate" = NOW()
             WHERE "chapterId" = $2
             RETURNING "chapterId", "chapterTitle", "chapterText", "updateDate"`,
            [chapterText.trim(), chapterId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương cần cập nhật" });
        }

        // ✅ Phản hồi
        return res.status(200).json({
            message: "Cập nhật nội dung chương thành công",
            chapter: result.rows[0],
        });

    } catch (err) {
        console.error("putUpdateChapterText error:", err);
        return res.status(500).json({ message: "Lỗi khi cập nhật nội dung chương" });
    }
};

exports.setChapterPrice = async (req, res) => {
    const { chapterId } = req.params;
    const { price } = req.body;

    // Kiểm tra đầu vào
    if (price == null || isNaN(price) || price < 0) {
        return res.status(400).json({ message: "Giá chương không hợp lệ" });
    }

    try {
        const result = await pool.query(
            `UPDATE "chapter" 
       SET "price" = $1 
       WHERE "chapterId" = $2
       RETURNING "chapterId", "price"`,
            [price, chapterId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương" });
        }

        res.json({
            message: "Cập nhật giá chương thành công",
            chapter: result.rows[0],
        });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật giá chương:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật giá chương" });
    }
};

exports.buyChapter = async (req, res) => {
    const { chapterId } = req.params;
    const accountId = req.user?.accountId;

    if (!chapterId || isNaN(chapterId)) return res.status(400).json({ message: "chapterId không hợp lệ" });
    if (!accountId) return res.status(401).json({ message: "Không xác thực được tài khoản" });

    try {
        // 🔹 Lấy thông tin chương và uploader
        const chapter = await chapterService.getChapterWithUploader(pool, chapterId);
        if (!chapter) return res.status(404).json({ message: "Không tìm thấy chương" });

        const { price, uploaderId } = chapter;

        // 🔹 Kiểm tra giá và quyền mua
        if (!price || price <= 0) return res.status(400).json({ message: "Chương miễn phí" });
        if (uploaderId === accountId) return res.status(400).json({ message: "Không thể mua chương của chính mình" });

        // 🔹 Kiểm tra đã mua chưa
        if (await chapterService.checkAlreadyPurchased(pool, accountId, chapterId))
            return res.status(400).json({ message: "Đã mua chương này" });

        // 🔹 Kiểm tra số dư
        const balance = await chapterService.getBalance(pool, accountId);
        if (balance === null) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        if (balance < price) return res.status(400).json({ message: "Số dư không đủ" });

        // 🔹 Thực hiện thanh toán
        await chapterService.transferCoins(pool, accountId, uploaderId, price);

        // 🔹 Ghi transaction và purchase
        const transactionId = await chapterService.createTransaction(pool, accountId, chapterId, price);
        await chapterService.recordChapterPurchase(pool, accountId, chapterId, transactionId);

        return res.status(200).json({
            message: "Mua chương thành công",
            data: { chapterId, price, buyerId: accountId, uploaderId, transactionId },
        });

    } catch (err) {
        console.error("buyChapter error:", err);
        return res.status(500).json({ message: "Lỗi khi mua chương" });
    }
};

exports.getChaptersByStatusId = async (req, res) => {
    try {
        const { chapterStatusId } = req.params;
        const statusIdNum = Number(chapterStatusId);
        if (!statusIdNum) {
            return res.status(400).json({ message: "Thiếu hoặc không hợp lệ chapterStatusId" });
        }

        const result = await pool.query(`
            SELECT
                c."chapterId",
                c."chapterTitle",
                c."chapterIndex",
                c."createDate",
                c."updateDate",
                cs."chapterStatusId",
                n."novelId",
                n."novelTitle"
            FROM "chapter" c
                     JOIN "chapter_status" cs
                          ON c."chapterStatusId" = cs."chapterStatusId"
                     JOIN "novel_info" n
                          ON c."novelId" = n."novelId"
            WHERE cs."chapterStatusId" = $1
            ORDER BY n."novelId" ASC, c."chapterIndex" ASC
        `, [statusIdNum]);

        // Nhóm theo novel
        const novelsMap = result.rows.reduce((acc, row) => {
            const novelId = row.novelId;
            if (!acc[novelId]) {
                acc[novelId] = {
                    novelId: row.novelId,
                    novelTitle: row.novelTitle,
                    chapters: []
                };
            }
            acc[novelId].chapters.push({
                chapterId: row.chapterId,
                chapterTitle: row.chapterTitle,
                chapterIndex: row.chapterIndex,
                createDate: row.createDate,
                updateDate: row.updateDate,
                chapterStatusId: row.chapterStatusId
            });
            return acc;
        }, {});

        // Chỉ lấy các novel có ít nhất 1 chapter
        const novelsList = Object.values(novelsMap).filter(novel => novel.chapters.length > 0);

        // ✅ Wrap vào object 'novels'
        res.json({ novels: novelsList });
    } catch (err) {
        console.error("getChaptersByStatusId error:", err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách chapter" });
    }
};


exports.getChapterTextById = async (req, res) => {
    try {
        const chapterId = Number(req.params.chapterId);
        if (!chapterId) return res.status(400).json({ message: "Thiếu chapterId" });

        const result = await pool.query(`
            SELECT 
                "chapterId",
                "chapterTitle",
                "chapterText",
                "novelId"
            FROM "chapter"
            WHERE "chapterId" = $1
        `, [chapterId]);

        if (!result.rows.length) {
            return res.status(404).json({ message: "Chapter không tồn tại" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("getChapterTextById error:", err);
        res.status(500).json({ message: "Lỗi server khi lấy nội dung chapter" });
    }
};