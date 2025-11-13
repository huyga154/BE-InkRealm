const pool = require("../config/db");
require("dotenv").config();

exports.getTransactionHistory = async (req, res) => {
    try {
        const { transactionId } = req.query;
        const accountId = req.user?.accountId;

        if (!accountId) {
            return res.status(401).json({ message: 'Không tìm thấy accountId trong token' });
        }

        const params = [accountId];
        let query = `
            SELECT "transactionId", "dats", "transaction_data", "coin_change"
            FROM "transaction_history"
            WHERE "accountId" = $1
        `;

        if (transactionId) {
            params.push(Number(transactionId));
            query += ` AND "transactionId" < $2`;
        }

        // Keyset pagination + index hỗ trợ
        query += ` ORDER BY "transactionId" DESC LIMIT 10`;

        const { rows } = await pool.query(query, params);

        res.json({
            message: 'Lấy lịch sử giao dịch thành công',
            transactions: rows,
            hasMore: rows.length === 10,
        });
    } catch (err) {
        console.error('getTransactionHistory error:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử giao dịch' });
    }
};

