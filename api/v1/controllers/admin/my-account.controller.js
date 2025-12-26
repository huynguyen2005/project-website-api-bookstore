const Account = require("../../models/account.model");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");
const bcrypt = require('bcrypt');

// [GET] /my-account/
module.exports.index = async (req, res) => {
    const id = req.accountId;
    try {
        const accountInfor = await Account.findById(id).select("email fullName phone address birthday avatar role_id").populate({
            path: "role_id",
            select: "name"
        });
        res.json(accountInfor);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server!"
        });
    }
};

// [PUT] /my-account/
module.exports.editInfor = async (req, res) => {
    let { email, fullName, phone, address, birthday, avatar } = req.body;
    const id = req.accountId;
    try {
        if (email) {
            const emailExit = await Account.findOne({ email, _id: { $ne: id } });
            if (emailExit) return res.status(400).json({ message: "Email đã tồn tại!" });
        }
        if (avatar) {
            const result = await uploadToCloudinaryHelper.uploader.upload(avatar);
            avatar = result.secure_url;
        }
        await Account.findByIdAndUpdate(id, { email, fullName, phone, address, birthday, avatar });
        res.json({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server!"
        });
    }
};

// [PUT] /my-account/password
module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const myAccount = await Account.findOne({
            _id: req.accountId
        }).select("password");
        const check = await bcrypt.compare(oldPassword, myAccount.password);
        if (!check) return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await Account.updateOne({ _id: req.accountId }, { password: hashed });
        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server!"
        });
    }

};