const pool = require("../config/db");

// Helper query
const queryDB = async (query, params = []) => {
    const { rows } = await pool.query(query, params);
    return rows[0]?.revenue || 0;
};

// 1️⃣ Doanh thu hôm nay
exports.getTodayRevenue = async (req, res) => {
    try {
        const sql = `
      SELECT COALESCE(SUM(CAST(REPLACE(coin_change, '+', '') AS INTEGER)), 0) AS revenue
      FROM transaction_history
      WHERE DATE(dats) = CURRENT_DATE
        AND transaction_data LIKE 'Nạp tiền vào tài khoản%'
        AND CAST(REPLACE(coin_change, '+', '') AS INTEGER) > 0
    `;
        const revenue = await queryDB(sql);
        res.json({ date: new Date().toISOString().split('T')[0], revenue });
    } catch (err) {
        console.error("❌ getTodayRevenue error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 2️⃣ Doanh thu theo ngày cụ thể
exports.getRevenueByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const sql = `
      SELECT COALESCE(SUM(CAST(REPLACE(coin_change, '+', '') AS INTEGER)), 0) AS revenue
      FROM transaction_history
      WHERE DATE(dats) = $1
        AND transaction_data LIKE 'Nạp tiền vào tài khoản%'
        AND CAST(REPLACE(coin_change, '+', '') AS INTEGER) > 0
    `;
        const revenue = await queryDB(sql, [date]);
        res.json({ date, revenue });
    } catch (err) {
        console.error("❌ getRevenueByDate error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getRevenueBetween = async (req, res) => {
    try {
        const { from, to } = req.params;

        // 🧮 1️⃣ Query từng ngày
        const sqlDaily = `
            SELECT
                DATE(dats) AS date,
                COALESCE(SUM(CAST(REPLACE(coin_change, '+', '') AS INTEGER)), 0) AS revenue
            FROM transaction_history
            WHERE DATE(dats) BETWEEN $1 AND $2
              AND transaction_data LIKE 'Nạp tiền vào tài khoản%'
              AND CAST(REPLACE(coin_change, '+', '') AS INTEGER) > 0
            GROUP BY DATE(dats)
            ORDER BY DATE(dats)
        `;

        const { rows: dailyRows } = await pool.query(sqlDaily, [from, to]);

        // 🧮 2️⃣ Tính tổng revenue
        const totalRevenue = dailyRows.reduce((sum, row) => sum + parseInt(row.revenue), 0);

        // 🧮 3️⃣ Format kết quả
        const dailyRevenue = dailyRows.map(row => ({
            date: row.date.toISOString().split('T')[0],
            revenue: parseInt(row.revenue)
        }));

        res.json({
            from,
            to,
            totalRevenue,
            dailyRevenue
        });
    } catch (err) {
        console.error("❌ getRevenueBetween error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 4️⃣ Doanh thu năm nay
exports.getThisYearRevenue = async (req, res) => {
    try {
        const sql = `
      SELECT COALESCE(SUM(CAST(REPLACE(coin_change, '+', '') AS INTEGER)), 0) AS revenue
      FROM transaction_history
      WHERE EXTRACT(YEAR FROM dats) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND transaction_data LIKE 'Nạp tiền vào tài khoản%'
        AND CAST(REPLACE(coin_change, '+', '') AS INTEGER) > 0
    `;
        const revenue = await queryDB(sql);
        res.json({ year: new Date().getFullYear(), revenue });
    } catch (err) {
        console.error("❌ getThisYearRevenue error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 5️⃣ Tổng doanh thu tất cả thời gian
exports.getTotalRevenue = async (req, res) => {
    try {
        const sql = `
      SELECT COALESCE(SUM(CAST(REPLACE(coin_change, '+', '') AS INTEGER)), 0) AS revenue
      FROM transaction_history
      WHERE transaction_data LIKE 'Nạp tiền vào tài khoản%'
        AND CAST(REPLACE(coin_change, '+', '') AS INTEGER) > 0
    `;
        const revenue = await queryDB(sql);
        res.json({ totalRevenue: revenue });
    } catch (err) {
        console.error("❌ getTotalRevenue error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
