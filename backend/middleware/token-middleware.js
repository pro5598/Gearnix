const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function authenticateToken(req, res, next) {
  // Skip token verification for login and register routes
  if (req.path === "/api/auth/login" || req.path === "/api/auth/register") {
    return next();
  }

  // Get token from Authorization header (case-insensitive header name)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded; // Attach decoded payload to request object
    next();
  });
}

module.exports = authenticateToken;
