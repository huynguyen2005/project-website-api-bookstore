const jwt = require('jsonwebtoken');
const accessControlListHelper = require("../../../../helpers/accessControlList");

module.exports.verifyToken = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json("Bạn chưa đăng nhập!");
    const accessToken = req.headers.authorization.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, payload) => {
        if (err) return res.status(401).json("Token bị sai hoặc hết hạn!");
        req.accountId = payload.id;
        req.permissions = payload.permissions;
        next();
    });
}; 

module.exports.verifyRole = (req, res, next) => {
    const permissions = req.permissions; 
    const key = `${req.method} ${req.originalUrl}`;

    const requirePermission = accessControlListHelper[key];

    if(!requirePermission)   return next();
    if(!permissions?.includes(requirePermission))    return res.status(403).json("Bạn không có quyền truy cập!");
    next();
};