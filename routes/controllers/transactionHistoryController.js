// const getTransactionHistoryQuery = (filters) => {
//     const { accountId, chapterId, novelId, startDate, endDate } = filters;
//     let conditions = [];
//     let values = [];
//     let idx = 1;
//
//     if (accountId) {
//         conditions.push(`"transaction_history"."accountId" = $${idx++}`);
//         values.push(accountId);
//     }
//     if (chapterId) {
//         conditions.push(`"chapter_purchase"."chapterId" = $${idx++}`);
//         values.push(chapterId);
//     }
//     if (novelId) {
//         conditions.push(`"novel_purchase"."novelId" = $${idx++}`);
//         values.push(novelId);
//     }
//     if (startDate) {
//         conditions.push(`"transaction_history"."dats" >= $${idx++}`);
//         values.push(startDate);
//     }
//     if (endDate) {
//         conditions.push(`"transaction_history"."dats" <= $${idx++}`);
//         values.push(endDate);
//     }
//
//     const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
//
//     const query = `
//         SELECT
//             "transaction_history".*,
//             "account"."username",
//             "account"."fullName",
//             "chapter_purchase"."chapterId" AS purchased_chapter_id,
//             "novel_purchase"."novelId" AS purchased_novel_id
//         FROM "transaction_history"
//         LEFT JOIN "account" ON "account"."accountId" = "transaction_history"."accountId"
//         LEFT JOIN "chapter_purchase" ON "chapter_purchase"."transactionId" = "transaction_history"."transactionId"
//         LEFT JOIN "novel_purchase" ON "novel_purchase"."transactionId" = "transaction_history"."transactionId"
//         ${whereClause}
//         ORDER BY "transaction_history"."dats" DESC
//     `;
//     return { query, values };
// };

// ádasdassd