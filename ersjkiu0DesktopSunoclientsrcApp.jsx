warning: in the working copy of 'server/server.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/server/server.js b/server/server.js[m
[1mindex 8d48ae7..1f9213b 100644[m
[1m--- a/server/server.js[m
[1m+++ b/server/server.js[m
[36m@@ -9,7 +9,8 @@[m [mconst mongoose = require("mongoose");[m
 const bcrypt = require("bcryptjs");[m
 const jwt = require("jsonwebtoken");[m
 const multer = require("multer");[m
[31m-[m
[32m+[m[32mconst nodemailer = require("nodemailer");[m
[32m+[m[32mconst crypto = require("crypto");[m
 const app = express();[m
 [m
 cloudinary.config({[m
[36m@@ -38,7 +39,13 @@[m [mmongoose[m
 /* ================= HELPERS ================= */[m
 [m
 const JWT_SECRET = process.env.JWT_SECRET || "sunora_secret_key_change_this";[m
[31m-[m
[32m+[m[32mconst transporter = nodemailer.createTransport({[m
[32m+[m[32m  service: "gmail",[m
[32m+[m[32m  auth: {[m
[32m+[m[32m    user: process.env.EMAIL_USER,[m
[32m+[m[32m    pass: process.env.EMAIL_PASS[m
[32m+[m[32m  }[m
[32m+[m[32m});[m
 const getSupportMessageByLanguage = (language) => {[m
   if (language === "english") return "I'm here. Take your time.";[m
   if (language === "hindi") return "मैं यहीं हूँ। आराम से बोलिए।";[m
[36m@@ -200,7 +207,19 @@[m [mconst userSchema = new mongoose.Schema([m
     password: {[m
       type: String,[m
       required: true[m
[31m-    }[m
[32m+[m[32m    },[m
[32m+[m[32m    isVerified: {[m
[32m+[m[32m  type: Boolean,[m
[32m+[m[32m  default: false[m
[32m+[m[32m},[m
[32m+[m[32mverificationToken: {[m
[32m+[m[32m  type: String,[m
[32m+[m[32m  default: ""[m
[32m+[m[32m},[m
[32m+[m[32mverificationTokenExpires: {[m
[32m+[m[32m  type: Date,[m
[32m+[m[32m  default: null[m
[32m+[m[32m}[m
   },[m
   { timestamps: true }[m
 );[m
[36m@@ -365,23 +384,40 @@[m [mapp.post("/api/auth/signup", async (req, res) => {[m
     }[m
 [m
     const hashedPassword = await bcrypt.hash(password, 10);[m
[32m+[m[32m    const verificationToken = crypto.randomBytes(32).toString("hex");[m
 [m
     const user = await User.create({[m
       name: name.trim(),[m
       email: email.trim().toLowerCase(),[m
[31m-      password: hashedPassword[m
[32m+[m[32m      password: hashedPassword,[m
[32m+[m[32m      isVerified: false,[m
[32m+[m[32m      verificationToken,[m
[32m+[m[32m      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000[m
     });[m
 [m
[31m-    const token = createToken(user._id);[m
[32m+[m[32m    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;[m
[32m+[m
[32m+[m[32m    await transporter.sendMail({[m
[32m+[m[32m      from: process.env.EMAIL_USER,[m
[32m+[m[32m      to: user.email,[m
[32m+[m[32m      subject: "Verify your email - Sunora",[m
[32m+[m[32m      html: `[m
[32m+[m[32m        <div style="font-family: Arial, sans-serif; line-height: 1.6;">[m
[32m+[m[32m          <h2>Welcome to Sunora 💜</h2>[m
[32m+[m[32m          <p>Click the button below to verify your email:</p>[m
[32m+[m[32m          <p>[m
[32m+[m[32m            <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;">[m
[32m+[m[32m              Verify Email[m
[32m+[m[32m            </a>[m
[32m+[m[32m          </p>[m
[32m+[m[32m          <p>This link will expire in 24 hours.</p>[m
[32m+[m[32m        </div>[m
[32m+[m[32m      `[m
[32m+[m[32m    });[m
 [m
     res.json({[m
       success: true,[m
[31m-      token,[m
[31m-      user: {[m
[31m-        id: user._id,[m
[31m-        name: user.name,[m
[31m-        email: user.email[m
[31m-      }[m
[32m+[m[32m      message: "Account created. Please verify your email before logging in."[m
     });[m
   } catch (err) {[m
     console.error("Signup error:", err);[m
[36m@@ -391,7 +427,6 @@[m [mapp.post("/api/auth/signup", async (req, res) => {[m
     });[m
   }[m
 });[m
[31m-[m
 /* ===== AUTH: LOGIN ===== */[m
 app.post("/api/auth/login", async (req, res) => {[m
   try {[m
[36m@@ -412,17 +447,24 @@[m [mapp.post("/api/auth/login", async (req, res) => {[m
     }[m
 [m
     const user = await User.findOne({[m
[31m-      email: email.trim().toLowerCase()[m
[31m-    });[m
[32m+[m[32m  email: email.trim().toLowerCase()[m
[32m+[m[32m});[m
 [m
[31m-    if (!user) {[m
[31m-      return res.status(400).json({[m
[31m-        success: false,[m
[31m-        message: "Invalid email or password"[m
[31m-      });[m
[31m-    }[m
[32m+[m[32mif (!user) {[m
[32m+[m[32m  return res.status(400).json({[m
[32m+[m[32m    success: false,[m
[32m+[m[32m    message: "Invalid email or password"[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
 [m
[31m-    const isMatch = await bcrypt.compare(password, user.password);[m
[32m+[m[32mif (!user.isVerified) {[m
[32m+[m[32m  return res.status(400).json({[m
[32m+[m[32m    success: false,[m
[32m+[m[32m    message: "Please verify your email first"[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mconst isMatch = await bcrypt.compare(password, user.password);[m
 [m
     if (!isMatch) {[m
       return res.status(400).json({[m
[36m@@ -497,6 +539,44 @@[m [mapp.post("/api/admin/login", (req, res) => {[m
   });[m
 });[m
 [m
[32m+[m[32mapp.get("/api/auth/verify-email", async (req, res) => {[m
[32m+[m[32m  try {[m
[32m+[m[32m    const { token } = req.query;[m
[32m+[m
[32m+[m[32m    if (!token) {[m
[32m+[m[32m      return res.status(400).json({[m
[32m+[m[32m        success: false,[m
[32m+[m[32m        message: "Verification token missing"[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const user = await User.findOne({[m
[32m+[m[32m      verificationToken: token,[m
[32m+[m[32m      verificationTokenExpires: { $gt: Date.now() }[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m    if (!user) {[m
[32m+[m[32m      return res.status(400).json({[m
[32m+[m[32m        success: false,[m
[32m+[m[32m        message: "Invalid or expired verification link"[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    user.isVerified = true;[m
[32m+[m[32m    user.verificationToken = "";[m
[32m+[m[32m    user.verificationTokenExpires = null;[m
[32m+[m[32m    await user.save();[m
[32m+[m
[32m+[m[32m    return res.redirect(`${process.env.FRONTEND_URL}/?verified=true`);[m
[32m+[m[32m  } catch (err) {[m
[32m+[m[32m    console.error("Verify email error:", err);[m
[32m+[m[32m    return res.status(500).json({[m
[32m+[m[32m      success: false,[m
[32m+[m[32m      message: "Server error"[m
[32m+[m[32m    });[m
[32m+[m[32m  }[m
[32m+[m[32m});[m
[32m+[m
 /* ===== START CHAT ===== */[m
 app.post("/api/chat/start", optionalAuthMiddleware, async (req, res) => {[m
   try {[m
