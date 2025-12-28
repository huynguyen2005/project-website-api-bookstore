const jwt = require('jsonwebtoken');

module.exports.generateAccessToken = (user) => {
    const payload = {
        id: user.id
    };
    if (user.role_id) payload["permissions"] = user.role_id.permissions;
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "5m" });
    return accessToken;
};

module.exports.generateRefreshToken = (user) => {
    const payload = {
        id: user.id
    };
    if (user.role_id) payload["permissions"] = user.role_id.permissions;
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
    return refreshToken;
};