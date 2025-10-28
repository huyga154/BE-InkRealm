const express = require("express");

const { getTodayRevenue,
        getRevenueByDate,
        getRevenueBetween,
        getThisYearRevenue
        } = require("../../controllers/revenueController");
const { deleteAccount,
        updateAccount,
        createAccount
        } = require("../../service/accountService");
const { getRoles
        } = require("../../controllers/adminController");
const router = express.Router();

// 🔹 GET /api/revenue/today
router.get("/admin/dashboard/revenue/today", getTodayRevenue);

// 🔹 GET /api/revenue/date/:date  (VD: /api/revenue/date/2025-10-28)
router.get("/admin/dashboard/revenue/date/:date", getRevenueByDate);

// 🔹 GET /api/revenue/range/:from/:to  (VD: /api/revenue/range/2025-10-01/2025-10-28)
router.get("/admin/dashboard/revenue/range/:from/:to", getRevenueBetween);

// 🔹 GET /api/revenue/year
router.get("/admin/dashboard/revenue/year", getThisYearRevenue);


router.get('/admin/roles/all', getRoles);
router.post('/admin/account/create', createAccount);
router.put('/admin/account/:accountId/update', updateAccount);
router.delete('/admin/account/:accountId/delete', deleteAccount);

module.exports = router;
