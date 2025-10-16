// utils/logResponse.js
function sendResponseWithLog(res, req, data, status = 200, includeLog = true) {
    if (includeLog) {
        const requestLog = {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body
        };

        const responseLog = {
            headers: res.getHeaders(),
            body: data
        };

        console.log("Request:", requestLog);
        console.log("Response:", responseLog);

        return res.status(status).json({
            log: {
                request: requestLog,
                response: responseLog
            },
            data: data
        });
    } else {
        // Trả về dữ liệu bình thường, không log
        return res.status(status).json(data);
    }
}

module.exports = sendResponseWithLog;
