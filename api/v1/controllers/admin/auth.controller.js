const Account = require("../../models/account.model");
const ForgotPassword = require("../../models/forgot-password.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require("../../../../helpers/auth");
const { sendMail } = require("../../../../helpers/mail");
const crypto = require("crypto");

let refreshTokens = [];

// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
    const account = await Account.findOne({ email: req.body.email }).populate("role_id");
    if (!account) return res.status(401).json({ success: false, message: "Email không tồn tại!" });
    const validPassword = await bcrypt.compare(req.body.password, account.password);
    if (!validPassword) return res.status(401).json({ success: false, message: "Mật khẩu không chính xác!" });
    if (account.status === "inactive") return res.status(403).json({ success: false, message: "Tài khoản đã bị khóa!" });

    const accessToken = authHelper.generateAccessToken(account);
    const refreshToken = authHelper.generateRefreshToken(account);
    refreshTokens.push(refreshToken);

    res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true, //JS không đọc được
        secure: false, //Nếu để là true cookies chỉ gửi qua HTTPS
        path: "/", //Cookie có hiệu lực toàn domain
    });

    // const { password, ...accountInfor } = account._doc;
    res.json({ accessToken });
};

// [POST] /admin/auth/refresh-token
module.exports.requestRefreshToken = (req, res) => {
    const refreshToken = req.cookies.adminRefreshToken;
    if (!refreshTokens.includes(refreshToken)) return res.status(401).json("adminRefreshToken không tồn tại!");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, payload) => {
        if (error) return res.status(401).json("adminRefreshToken bị sai hoặc hết hạn!");

        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        const newAccessToken = authHelper.generateAccessToken(payload);
        const newRefreshToken = authHelper.generateRefreshToken(payload);
        refreshTokens.push(newRefreshToken);

        res.cookie("adminRefreshToken", newRefreshToken, {
            httpOnly: true, //JS không đọc được
            secure: false, //Nếu để là true cookies chỉ gửi qua HTTPS
            path: "/", //Cookie có hiệu lực toàn domain
        });

        res.json({ accessToken: newAccessToken });
    });

};

// [POST] /admin/auth/logout
module.exports.logout = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.adminRefreshToken);
    res.clearCookie("adminRefreshToken");
    res.json({
        success: true,
        message: "Đăng xuất thành công"
    });
};


// [POST] /admin/auth/forgot-password
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const exitEmail = await Account.findOne({ email });
        if (!exitEmail) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }
        const emailIsSentOTP = await ForgotPassword.findOne({ email });
        if (emailIsSentOTP) {
            return res.status(409).json({ message: "Đã gửi OTP!" });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");

        await ForgotPassword.create({
            email,
            otp: hashOtp,
            expiredAt: Date.now()
        });

        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời gian sử dụng là 3 phút`;
        sendMail(email, subject, html);
        res.json({ message: "OTP đã được gửi về email" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


// POST /admin/auth/reset-password
module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const record = await ForgotPassword.findOne({ email });
        if (!record)
            return res.status(400).json({ message: "OTP hết hạn hoặc không tồn tại!" });

        const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");
        if (hashOtp !== record.otp)
            return res.status(400).json({ message: "OTP không đúng!" });

        const hashPassword = await bcrypt.hash(newPassword, 10);
        await Account.findOneAndUpdate(
            { email },
            { password: hashPassword }
        );

        await ForgotPassword.deleteOne({ email });

        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

