const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    let token;

    // Check if token is in the cookie header
    if (req.headers.cookie && req.headers.cookie.includes("jwt=")) {
      token = req.headers.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("jwt="))
        .split("=")[1];
    }

    // Check if token is in the authorization header (Bearer token)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication required. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Function for role-based authorization
exports.authorization = (...requiredRole) => {
  return (req, res, next) => {
    // Check if user exists and has the required role
    if (
      !req.user ||
      (requiredRole.length && !requiredRole.includes(req.user.type))
    ) {
      return res.status(403).json({ message: "Role not authorized" });
    }
    next();
  };
};
