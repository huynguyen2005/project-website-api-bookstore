const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json("Bạn chưa xác thực!");
    }
    const accessToken = req.headers.authorization.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, payload) => {
        if (err) return res.status(401).json("Token bị sai hoặc hết hạn!");
        req.user = payload;
        next(); 
    });
};