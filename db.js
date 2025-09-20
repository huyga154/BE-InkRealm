// db.js
const { Pool } = require("pg");

let pool;

if (!global.pgPool) {
    pool = new Pool({
        user: "avnadmin",
        password: "AVNS_YwGi8OmQC3UcQ5LcEPf",
        host: "pg-20c99ba4-huyga154-exe.c.aivencloud.com",
        port: 23573,
        database: "defaultdb",
        ssl: { rejectUnauthorized: false },
    });
    global.pgPool = pool;
} else {
    pool = global.pgPool;
}

module.exports = pool;