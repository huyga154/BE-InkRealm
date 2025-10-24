// Lấy thông tin chương và uploader
async function getChapterWithUploader(pool, chapterId) {
    const res = await pool.query(
        `SELECT c."chapterId", c."price", n."accountId" AS "uploaderId"
         FROM "chapter" c
                  JOIN "novel_info" n ON c."novelId" = n."novelId"
         WHERE c."chapterId" = $1`,
        [chapterId]
    );
    return res.rows[0] || null;
}

// Kiểm tra người dùng đã mua chưa
async function checkAlreadyPurchased(pool, accountId, chapterId) {
    const res = await pool.query(
        `SELECT 1 FROM "chapter_purchase" WHERE "accountId" = $1 AND "chapterId" = $2`,
        [accountId, chapterId]
    );
    return res.rows.length > 0;
}

// Lấy số dư người dùng
async function getBalance(pool, accountId) {
    const res = await pool.query(
        `SELECT "coin" FROM "account" WHERE "accountId" = $1`,
        [accountId]
    );
    if (res.rows.length === 0) return null;
    return parseInt(res.rows[0].coin);
}

// Cập nhật số dư người mua và uploader
async function transferCoins(pool, buyerId, uploaderId, amount) {
    await pool.query(`UPDATE "account" SET "coin" = "coin" - $1 WHERE "accountId" = $2`, [amount, buyerId]);
    await pool.query(`UPDATE "account" SET "coin" = "coin" + $1 WHERE "accountId" = $2`, [amount, uploaderId]);
}

// Ghi lịch sử giao dịch và trả transactionId
async function createTransaction(pool, accountId, chapterId, price) {
    const res = await pool.query(
        `INSERT INTO "transaction_history"("accountId", "transaction_data", "coin_change")
         VALUES ($1, $2, $3) RETURNING "transactionId"`,
        [accountId, `Mua chương ${chapterId}`, -price]
    );
    return res.rows[0].transactionId;
}

// Ghi lịch sử mua chương
async function recordChapterPurchase(pool, accountId, chapterId, transactionId) {
    await pool.query(
        `INSERT INTO "chapter_purchase"("accountId", "chapterId", "transactionId")
         VALUES ($1, $2, $3)`,
        [accountId, chapterId, transactionId]
    );
}

module.exports = {
    getChapterWithUploader,
    checkAlreadyPurchased,
    getBalance,
    transferCoins,
    createTransaction,
    recordChapterPurchase,
};
