const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { secret_key, JWT_secret, myEmail, myPass } = require("../environment");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const fetchuser = require("../middleware/fetchuser");
const otp_gen = require("otp-generator");
const OTP = require("../models/otp");
const nodemailer = require("nodemailer");

// YOU HAVE TO CREATE PERSONAL TEAM FOR EACH USER
/**
 * first take email in forgot password
 * then if success is true
 * send request to change password.
 */

router.post("/createuser", async (req, res) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(401).json({ success: false, error: "email already exists", code: "eae" });
    }
    const secPass = crypto.AES.encrypt(req.body.password, secret_key).toString();
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const authtoken = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_secret, { expiresIn: "30d" });
    return res.status(200).json({ success: true, authtoken });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials", code: "edne" });
    }
    if (crypto.AES.decrypt(user.password, secret_key).toString(crypto.enc.Utf8) !== req.body.password) {
      return res.status(401).json({ success: false, error: "Invalid credentials", code: "wp" });
    }
    const authtoken = jwt.sign({ id: user._id, email: user.email }, JWT_secret, { expiresIn: "30d" });
    return res.status(200).json({ success: true, authtoken });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const id = req.data.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found", code: "unf" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.post("/sendotp", fetchuser, async (req, res) => {
  try {
    const otp = otp_gen.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const user = await User.findByIdAndUpdate(req.data.id, { isVerified: false }, { new: true }).select("-password");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: myPass,
      },
    });
    await transporter.sendMail({
      from: myEmail,
      to: user.email,
      subject: "OTP for Zanager verification",
      text: `Your OTP is ${otp} and will expire in 5 minutes`,
    });

    const otp_sent = await OTP.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, code: otp, expiry: Date.now() + 5 * 60 * 1000 },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, otp_sent });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.post("/verifyotp", fetchuser, async (req, res) => {
  try {
    const otp_input = req.body.otp;
    const otp = await OTP.findOne({ userId: req.data.id });
    const now = Date.now();
    if (!otp) {
      return res.status(401).json({ success: false, error: "OTP not found in db", code: "onf" });
    }
    if (now > otp.expiry) {
      return res.status(401).json({ success: false, error: "OTP expired", code: "oe" });
    }
    if (otp_input != otp.code) {
      return res.status(401).json({ success: false, error: "Incorrect OTP", code: "io" });
    }
    const user = await User.findByIdAndUpdate(otp.userId, { isVerified: true }, { new: true }).select("-password");
    return res.status(200).json({ success: true, user, message: "Verified" });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.get("/comparepassword", fetchuser, async (req, res) => {
  try {
    const input_pass = req.body.password;
    let user = await User.findById(req.data.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found", code: "unf" });
    }
    const user_pass = crypto.AES.decrypt(user.password, secret_key).toString(crypto.enc.Utf8);
    if (input_pass !== user_pass) {
      return res.status(401).json({ success: false, equalPass: false, message: "password is not same", code: "pns" });
    }
    return res.status(200).json({ success: true, equalsPass: true, message: "Passwords match" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err, message: "Internal server error" });
  }
});

router.post("/changepassword", fetchuser, async (req, res) => {
  try {
    let user = await User.findById(req.data.id);
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "User not verified", code: "unv" });
    }
    const new_pass = crypto.AES.encrypt(req.body.password, secret_key).toString();
    user = await User.findByIdAndUpdate(req.data.id, { password: new_pass }, { new: true });
    return res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

router.get("/getuser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found", code: "unf" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
  }
});

module.exports = router;
