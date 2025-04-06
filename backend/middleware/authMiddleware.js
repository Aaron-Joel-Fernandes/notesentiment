const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(403).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;
