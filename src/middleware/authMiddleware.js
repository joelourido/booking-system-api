import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
  // Get the token from the header
  // format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  // Get just the token part
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // If there is a token, verify it
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    // Attach the user to the request object
    req.user = user;
    
    // Move to the next stop (controller)
    next();
  });
}