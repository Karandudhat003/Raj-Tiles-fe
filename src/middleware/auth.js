const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "supersecretkey"; // Use .env in production

exports.authenticate = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ success: false, message: "No token." });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: "Malformed token." });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: insufficient role." });
    }
    next();
};
