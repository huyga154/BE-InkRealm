const { Pool } = require("pg");

let pool2;

if (!global.pgPool2) {
    pool2 = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
    });
    global.pgPool2 = pool2;
} else {
    pool2 = global.pgPool2;
}

module.exports = {
    pool2,
    getClient: async () => await pool2.connect(),
};
