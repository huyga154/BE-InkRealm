const app = require("../app");

// Vercel cần export handler function
module.exports = (req, res) => {
    app(req, res);
};
