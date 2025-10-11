// 📁 config/corsConfig.js
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
    process.env.BACKEND_URL,
    process.env.FRONTEND_URL, // ✅ Vercel FE
    "http://localhost:5173",  // ✅ React local dev
    "http://localhost:3000"   // ✅ fallback cho dev khác
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
