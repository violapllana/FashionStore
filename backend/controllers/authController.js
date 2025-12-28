const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");
const { sendMail } = require("../utils/mailer");


exports.auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      addressLine: user.addressLine || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      phone: user.phone || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { 
      name, 
      email, 
      password, 
      addressLine, 
      city, 
      postalCode, 
      phone 
    } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // 🔽 ADRESA
    if (addressLine) user.addressLine = addressLine;
    if (city) user.city = city;
    if (postalCode) user.postalCode = postalCode;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        addressLine: user.addressLine,
        city: user.city,
        postalCode: user.postalCode,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      isVerified: false
    });

    // 🔐 token për verifikim
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    // 📧 EMAIL = OPTIONAL
    try {
      await sendMail({
        to: user.email,
        subject: "Verify your email",
        html: `Click <a href="${verifyUrl}">here</a> to verify your email`
      });
    } catch (emailErr) {
      console.log("Email failed:", emailErr.message);
    }

    // ✅ REGISTER = SUCCESS GJITHMONË
    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
      userId: user.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await sendMail({
      to: user.email,
      subject: "Verify your email",
      html: `Click <a href="${verifyUrl}">here</a> to verify your email`,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    res.json({ message: "Email verified" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
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

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

exports.me = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "addressLine", "city", "postalCode", "phone", "isVerified", "createdAt"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, addressLine, city, postalCode, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    // 🔹 Add address fields
    user.addressLine = addressLine ?? user.addressLine;
    user.city = city ?? user.city;
    user.postalCode = postalCode ?? user.postalCode;
    user.phone = phone ?? user.phone;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token" });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(400).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request:", email);

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.json({ message: "If user exists, reset email sent" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // 🔹 Për testing: mos dërgo email, vetëm shfaq linkun
    // await sendMail({
    //   to: user.email,
    //   subject: "Reset password",
    //   html: `Click <a href="${url}">here</a> to reset password`
    // });

    console.log(`Reset password URL: ${url}`);

    res.json({ message: "If user exists, reset email sent", resetUrl: url }); // optional resetUrl for testing
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: err.message });
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

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
