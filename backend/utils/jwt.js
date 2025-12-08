const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_SECRET);
};
