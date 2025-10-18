const { Pool } = require("pg");
require('dotenv').config(); // load .env

let pool;

if (!global.pgPool) {
    pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
    });
    global.pgPool = pool;
} else {
    pool = global.pgPool;
}

module.exports = pool;
