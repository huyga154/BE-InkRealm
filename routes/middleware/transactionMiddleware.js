const { getClient } = require("./db2");

async function transactionMiddleware(req, res, next) {
    const client = await getClient();
    req.trxClient = client;

    try {
        await client.query("BEGIN");
        await next(); // gọi các middleware/handler tiếp theo
        await client.query("COMMIT"); // commit nếu mọi thứ OK
    } catch (err) {
        try {
            await client.query("ROLLBACK"); // rollback nếu có lỗi
        } catch (rollbackErr) {
            console.error("Rollback error:", rollbackErr);
        }
        next(err); // tiếp tục truyền lỗi
    } finally {
        client.release();
    }
}

module.exports = transactionMiddleware;
