const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "unauthorized" });
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!decoded) return res.status(401).json({ message: "unauthorized" });

  req.user = decoded;
  next();
}

module.exports = auth;
