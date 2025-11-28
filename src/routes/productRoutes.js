
// const express = require("express");
// const router = express.Router();
// const {
//   addProduct,
//   getProducts,
//   getProductById,
//   editProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// // ✅ Product Routes
// router.post("/add", addProduct);           // POST /api/products/add
// router.get("/", getProducts);              // GET /api/products/
// router.get("/:id", getProductById);        // GET /api/products/:id
// router.put("/edit/:id", editProduct);      // PUT /api/products/edit/:id
// router.delete("/delete/:id", deleteProduct); // DELETE /api/products/delete/:id

// // Log routes for debugging
// console.log("📋 Product routes loaded:");
// console.log("   POST   /api/products/add");
// console.log("   GET    /api/products/");
// console.log("   GET    /api/products/:id");
// console.log("   PUT    /api/products/edit/:id");
// console.log("   DELETE /api/products/delete/:id");

// module.exports = router;



const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");

// 🔥 Authentication Middleware
const SECRET = process.env.JWT_SECRET || "supersecretkey";

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: "No token" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Token missing" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// ✅ Product Routes - ALL PROTECTED
router.post("/add", authenticate, addProduct);           
router.get("/", authenticate, getProducts);              
router.get("/:id", authenticate, getProductById);        
router.put("/edit/:id", authenticate, editProduct);      
router.delete("/delete/:id", authenticate, deleteProduct);

console.log("📋 Product routes loaded (with authentication):");
console.log("   POST   /api/products/add");
console.log("   GET    /api/products/");
console.log("   GET    /api/products/:id");
console.log("   PUT    /api/products/edit/:id");
console.log("   DELETE /api/products/delete/:id");

module.exports = router;
