// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing." });
    if (!authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid authorization format." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach whole decoded so name is available (we added name in token during register)
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
