// routes/utils/payos.js
const { PayOS } = require('@payos/node');
require('dotenv').config();

const payOS = new PayOS({
    clientId: process.env.CASSO_CLIENT_ID,
    apiKey: process.env.CASSO_API_KEY,
    checksumKey: process.env.CASSO_CHECKSUM_KEY,
});

module.exports = payOS;
