// utils/authMiddleware.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "dev_secret";

// In-memory refresh token store (should be synced with server.js)
let refreshTokens = {}; // ideally imported/shared with server.js

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "missing token" });

  const token = auth.replace("Bearer ", "");

  try {
    // Verify access token
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    // Token expired or invalid
    const refreshToken =
      req.headers["x-refresh-token"] || req.body.refreshToken;
    if (!refreshToken || !refreshTokens[refreshToken]) {
      return res
        .status(401)
        .json({ error: "token expired, please login again" });
    }

    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, secret);

      // Issue a new access token
      const newToken = jwt.sign(
        { id: payload.id, email: payload.email },
        secret,
        {
          expiresIn: "8h",
        }
      );

      // Send new token in header for frontend to update localStorage
      res.setHeader("x-access-token", newToken);

      req.user = payload;
      return next();
    } catch {
      return res.status(401).json({ error: "invalid refresh token" });
    }
  }
}

module.exports = authMiddleware;
