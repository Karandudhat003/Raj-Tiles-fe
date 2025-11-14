require("dotenv").config(); // make sure dotenv is installed
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345"; // fallback password

// 🔐 Verify Admin Password
exports.verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: "Access granted" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
