// transactionHistoryService.js
const pool = require("../db"); // pool chuẩn

exports.getTransactions = async ({ accountId, novelId, chapterId, startDate, endDate }) => {
    let conditions = [];
    let values = [];
    let idx = 1;

    if (accountId) {
        conditions.push(`"transaction_history"."accountId" = $${idx++}`);
        values.push(accountId);
    }

    if (novelId) {
        conditions.push(`"novel_purchase"."novelId" = $${idx++}`);
        values.push(novelId);
    }

    if (chapterId) {
        conditions.push(`"chapter_purchase"."chapterId" = $${idx++}`);
        values.push(chapterId);
    }

    if (startDate) {
        conditions.push(`"transaction_history"."dats" >= $${idx++}`);
        values.push(startDate);
    }

    if (endDate) {
        conditions.push(`"transaction_history"."dats" <= $${idx++}`);
        values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const query = `
        SELECT
            transaction_history.*,
            account.username,
            account.fullName,
            chapter_purchase."chapterId" AS purchased_chapter_id,
            novel_purchase."novelId" AS purchased_novel_id
        FROM "transaction_history"
                 LEFT JOIN "account" ON account."accountId" = transaction_history."accountId"
                 LEFT JOIN "chapter_purchase" ON chapter_purchase."transactionId" = transaction_history."transactionId"
                 LEFT JOIN "novel_purchase" ON novel_purchase."transactionId" = transaction_history."transactionId"
            ${whereClause}
        ORDER BY transaction_history."dats" DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
};
