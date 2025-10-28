const pool = require('../config/db');

exports.getAllRoles = async () => {
    const result = await pool.query('SELECT * FROM role ORDER BY "roleId"');
    return result.rows;
};
