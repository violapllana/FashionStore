  const bcrypt = require("bcrypt");
  const { User } = require("../models");
  const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
  const { sendMail } = require("../utils/mailer");
  const jwt = require("jsonwebtoken");

 exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // ruaj user-in në request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};


  exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email & password required" });
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: "Email exists" });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      // send verify email (token)
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
      await sendMail({ to: user.email, subject: "Verify your email", html: `Click <a href="${verifyUrl}">here</a> to verify.` });
      return res.json({ message: "Registered. Verify email." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };

  exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(400).json({ message: "Invalid token" });
      user.isVerified = true;
      await user.save();
      return res.json({ message: "Email verified" });
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token", error: err.message });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: "Invalid credentials" });
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  exports.refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: "No refresh token" });
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(400).json({ message: "Invalid refresh token" });
      const accessToken = generateAccessToken(user);
      return res.json({ accessToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token", error: err.message });
    }
  };

  exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email }});
      if (!user) return res.status(200).json({ message: "If user exists, reset email sent" }); // don't reveal existence
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendMail({ to: user.email, subject: "Reset password", html: `Click <a href="${url}">here</a> to reset password.`});
      return res.json({ message: "If user exists, reset email sent" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  exports.resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(400).json({ message: "Invalid token" });
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      return res.json({ message: "Password updated" });
    } catch (err) {
      return res.status(400).json({ message: "Invalid token", error: err.message });
    }
  };
