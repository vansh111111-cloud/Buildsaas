const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // Your User schema
const router = express.Router();
const passport = require("passport");
const nodemailer = require("nodemailer");
const axios = require("axios");
// ================= LOGIN PAGE =================
router.get("/", (req, res) => {
    res.render("auth", { error: null });
  });
 
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// ================= REGISTER PAGE =================
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// ================= REGISTER POST =================



// Registration POST
router.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword, "g-recaptcha-response": captcha } = req.body;

  try {
    // 1. CAPTCHA validation
  const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`, { method: "POST" });
    const captchaData = await captchaResponse.json();
    if (!captchaData.success) return res.render("register", { error: "CAPTCHA failed" });

    // 2. Password checks
    if (password !== confirmPassword) return res.render("register", { error: "Passwords do not match" });
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(password)) return res.render("register", { error: "Password too weak" });

    // 3. Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.render("register", { error: "Email already exists" });

    // 4. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    req.session.otp = otp;
    req.session.tempUser = { fullName, email, password }; // store temporarily


    
    // 5. Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for YourSaaS Registration",
      html: `<h3>Your OTP is <b>${otp}</b></h3><p>It expires in 10 minutes.</p>`
    });

    res.redirect("/verify-otp");
  } catch (err) {
    console.log(err);
    res.render("register", { error: "Something went wrong" });
  }
});

// OTP Verification
router.get("/verify-otp", (req, res) => {
  res.render("verify-otp", { error: null });
});

router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  if (parseInt(otp) !== req.session.otp) {
    return res.render("verify-otp", { error: "Invalid OTP" });
  }

  try {
    const { fullName, email, password } = req.session.tempUser;
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ fullName, email, password: hashedPassword });

    // Clear session temporary data
    req.session.otp = null;
    req.session.tempUser = null;

    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.render("verify-otp", { error: "Something went wrong" });
  }
});

// ================= LOGIN POST =================
router.post("/login", async (req, res) => {
  const { email, password ,"g-recaptcha-response": captcha } = req.body;

   try {
   // 1️⃣ First: Check if captcha exists
   if (!captcha) {
      return res.render("login", { error: "Please complete CAPTCHA" });
    }

    // 2️⃣ Verify captcha with Google
    const captchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: captcha
        }
      }
    );

    if (!captchaVerify.data.success) {
      return res.render("login", { error: "CAPTCHA verification failed" });
    }
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.render("login", { error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.render("login", { error: "Invalid password" });

    // Save user in session
    // 🔐 Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        plan: user.plan
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // 🍪 Store in secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    // Redirect after login
    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("login", { error: "Something went wrong" });
  }
});

router.get("/auth/google",
passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
"/auth/google/callback",
passport.authenticate("google", { failureRedirect: "/login", session: false }),
(req, res) => {

 const token = jwt.sign(
 { id: req.user._id },
 process.env.JWT_SECRET,
 { expiresIn: "7d" }
 );

 res.cookie("token", token, {
 httpOnly: true,
secure: process.env.NODE_ENV === "production",
 sameSite: "strict"
 });

 res.redirect("/dashboard");
}
);

router.get("/logout", (req, res) => {
  // If using cookies for JWT
  res.clearCookie("token");  // clear the JWT cookie
  res.redirect("/login");     // redirect user to login page
});
module.exports = router;
