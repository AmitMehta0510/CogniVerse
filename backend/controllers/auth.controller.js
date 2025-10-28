// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import User from "../models/user.model.js";
// import nodemailer from "nodemailer";

// const generateToken = (user) => {
//   return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // Register
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, username } = req.body;

//     if (!name || !email || !password || !username)
//       return res.status(400).json({ message: "All fields are required!" });

//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser)
//       return res
//         .status(400)
//         .json({ message: "User with this email or username already exists!" });

//     // DO NOT hash here — schema pre('save') will hash once
//     const user = await User.create({
//       name,
//       email,
//       username,
//       password, // raw password -> will be hashed by userSchema.pre('save')
//     });

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     // If validation error, return 400 with details
//     if (error.name === "ValidationError") {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login (unchanged)
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "All fields are required!" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found!" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials!" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Forgot Password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User with this email not found" });

//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"IoT Store" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: "Password Reset",
//       html: `
//         <p>You requested to reset your password.</p>
//         <p>Click below link to reset it:</p>
//         <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//       `,
//     });

//     res.json({ message: "Password reset email sent!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Reset Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user)
//       return res.status(400).json({ message: "Invalid or expired token" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required!" });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this email or username already exists!" });

    const user = await User.create({
      name,
      email,
      username,
      password, // schema will hash it
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ success acknowledgement
    res.status(201).json({
      success: true,
      message: "Registration successful! Redirecting to home...",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ success acknowledgement
    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User with this email not found!" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"IoT Store" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it (valid for 15 minutes):</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      `,
    });

    // ✅ acknowledgement
    res.json({ success: true, message: "Password reset email sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending email: " + err.message });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token!" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // ✅ acknowledgement
    res.json({ success: true, message: "Password reset successful! You can now login." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};
