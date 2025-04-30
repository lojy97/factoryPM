const jwt = require("jsonwebtoken");

function authorization(...requiredRole) {
  return (req, res, next) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader || !cookieHeader.includes("jwt=")) {
      return res.status(401).json({ message: "unauthorized" });
    }

    // Extract JWT token from cookie
    const token = cookieHeader
      .split(";")
      .find((cookie) => cookie.trim().startsWith("jwt="))
      .split("=")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role check: compare decoded.type or decoded.role with requiredRole
      if (requiredRole.length && !requiredRole.includes(decoded.type)) {
        return res.status(403).json({ message: "role not allowed" });
      }

      next(); // Proceed to controller
    } catch (err) {
      return res.status(401).json({ message: "invalid token" });
    }
  };
}

module.exports = { authorization };
