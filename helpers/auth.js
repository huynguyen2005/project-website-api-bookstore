const jwt = require('jsonwebtoken');

module.exports.generateAccessToken = (user) => {
    const payload = {
        id: user.id,
        permissions: user.permissions || user.role_id?.permissions || []
    };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "10m" });
    return accessToken;
};

module.exports.generateRefreshToken = (user) => {
    const payload = {
        id: user.id,
        permissions: user.permissions || user.role_id?.permissions || []
    };

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
    return refreshToken;
};