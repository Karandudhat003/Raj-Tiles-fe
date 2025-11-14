const express = require("express");
const router = express.Router();
const { verifyAdminPassword } = require("../controllers/adminController");

// 🔐 POST → verify admin password
router.post("/verify", verifyAdminPassword);

module.exports = router;
