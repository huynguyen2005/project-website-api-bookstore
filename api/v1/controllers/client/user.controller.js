const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require("../../../../helpers/auth");
let refreshTokens = [];

//[POST] /user/register
module.exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const emailExit = await User.findOne({ email: email });
        if (emailExit) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại!"
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            fullName: fullName,
            email: email,
            password: hashed
        });
        await user.save();
        res.json({
            success: true,
            message: "Đăng ký tài khoản thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đăng ký tài khoản thất bại!"
        });
    }
};

//[POST] /user/login
module.exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại!"
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Sai mật khẩu!"
            });
        }
        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Tài khoản đã bị khóa!"
            });
        }
        const accessToken = authHelper.generateAccessToken(user);
        const refreshToken = authHelper.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, //JS không đọc được
            secure: false, //Nếu để là true cookies chỉ gửi qua HTTPS
            path: "/", //Cookie có hiệu lực toàn domain
        });

        const { password, ...infor } = user._doc;
        res.json({ infor, accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Đăng nhập thất bại!"
        });
    }
};

//[POST] /user/refresh-token
module.exports.requestRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshTokens.includes(refreshToken)){
        return res.status(401).json("refreshToken không tồn tại!");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, payload) => {
        if(error){
            return res.status(401).json("refreshToken bị sai hoặc hết hạn!");
        }
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);
        
        const newAccessToken = authHelper.generateAccessToken(payload);
        const newRefreshToken = authHelper.generateRefreshToken(payload);
        refreshTokens.push(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true, //JS không đọc được
            secure: false, //Nếu để là true cookies chỉ gửi qua HTTPS
            path: "/", //Cookie có hiệu lực toàn domain
            sameSite: "strict"
        });

        res.json({  accessToken: newAccessToken });
    });
};

//[POST] /user/logout
module.exports.logout = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.json({
        success: true,
        message: "Đăng xuất thành công"
    });
};