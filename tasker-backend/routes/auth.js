const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { secret_key, JWT_secret } = require('../environment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const fetchuser = require('../middleware/fetchuser');
const otp_gen = require('otp-generator');
const OTP = require('../models/otp');

//YOU HAVE TO CREATE PERSONAL TEAM FOR EACH USER

router.post('/createuser', async (req, res) => {
    try {
        const email = await User.findOne({ email: req.body.email });
        if (email) {
            return res.status(401).json({ success: false, error: "email already exists", code: "eae" });
        }
        const secPass = crypto.AES.encrypt(req.body.password, secret_key).toString();
        const newUser = await User.create({ name: req.body.name, email: req.body.email, password: secPass });
        const authtoken = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_secret, { expiresIn: "30d" });

        return res.status(200).json({ success: true, authtoken });
    }
    catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials", code: "edne" });
        }
        if (crypto.AES.decrypt(user.password, secret_key).toString(crypto.enc.Utf8) != req.body.password) {
            return res.status(401).json({ success: false, error: "Invalid credentials", code: "wp" });
        }
        const authtoken = jwt.sign({ id: user._id, email: user.email }, JWT_secret, { expiresIn: "30d" });
        return res.status(200).json({ success: true, authtoken });
    }
    catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error" });
    }


});

router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const id = req.data.id;
        const user = await User.findById(id).select("-password");
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error" });
    }
});

router.post('/sendotp', fetchuser, (req, res) => {
    const otp = otp_gen.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    res.status(200).json(otp);
});


module.exports = router;