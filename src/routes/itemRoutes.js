// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const itemController = require("../controllers/itemController");

// // ✅ MUST USE MEMORY STORAGE FOR CLOUDINARY
// const storage = multer.memoryStorage();

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|gif|webp/;
//         const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
//         const mimetype = allowedTypes.test(file.mimetype);

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
//         }
//     },
// });

// // Define routes
// router.post("/", upload.single("image"), itemController.addItem);
// router.get("/", itemController.getAllItems);
// router.get("/:id", itemController.getItemById);
// router.put("/:id", upload.single("image"), itemController.updateItem);
// router.delete("/:id", itemController.deleteItem);

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const itemController = require("../controllers/itemController");

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

// ✅ Multer setup
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});

// ✅ Item Routes - ALL PROTECTED
router.post("/", authenticate, upload.single("image"), itemController.addItem);
router.get("/", authenticate, itemController.getAllItems);
router.get("/:id", authenticate, itemController.getItemById);
router.put("/:id", authenticate, upload.single("image"), itemController.updateItem);
router.delete("/:id", authenticate, itemController.deleteItem);

module.exports = router;
