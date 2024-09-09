const jwt = require('jsonwebtoken');
const { JWT_secret } = require('../environment.js');
const fetchuser = (req, res, next) => {
    try {
        const authtoken = req.header('authtoken');
        const data = jwt.verify(authtoken, JWT_secret);
        req.data = data;
        next();
    }
    catch (err) {
        return res.status(500).json({ success: false, err, error: "Internal server error at middleware", code: "mw" });
    }

}
module.exports = fetchuser;
