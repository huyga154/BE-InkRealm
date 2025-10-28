const express = require("express");

const { getTodayRevenue,
        getRevenueByDate,
        getRevenueBetween,
        getThisYearRevenue
        } = require("../../controllers/revenueController");
const { getRoles, createAccount, updateAccount, deleteAccount
} = require("../../controllers/adminController");
const {verifyToken, verifyAdmin} = require("../../middleware/authMiddleware");
const router = express.Router();

// 🔹 GET /api/revenue/today
router.get("/admin/dashboard/revenue/today",verifyToken,verifyAdmin, getTodayRevenue);

// 🔹 GET /api/revenue/date/:date  (VD: /api/revenue/date/2025-10-28)
router.get("/admin/dashboard/revenue/date/:date",verifyToken,verifyAdmin, getRevenueByDate);

// 🔹 GET /api/revenue/range/:from/:to  (VD: /api/revenue/range/2025-10-01/2025-10-28)
router.get("/admin/dashboard/revenue/range/:from/:to",verifyToken,verifyAdmin, getRevenueBetween);

// 🔹 GET /api/revenue/year
router.get("/admin/dashboard/revenue/year",verifyToken, verifyAdmin, getThisYearRevenue);


router.get('/admin/roles/all',verifyToken,verifyAdmin, getRoles);
router.post('/admin/account/create',verifyToken,verifyAdmin,createAccount);
router.put('/admin/account/:accountId/update',verifyToken,verifyAdmin,updateAccount);
router.delete('/admin/account/:accountId/delete',verifyToken,verifyAdmin, deleteAccount);

module.exports = router;
