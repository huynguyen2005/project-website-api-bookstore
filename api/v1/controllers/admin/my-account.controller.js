const Account = require("../../models/account.model");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");
const bcrypt = require('bcrypt');

// [GET] /my-account/
module.exports.index = async (req, res) => {
    const id = req.accountId;
    try {
        const accountInfor = await Account.findById(id).select("email fullName phone address birthday avatar");
        res.json(accountInfor);
    } catch (error) {
        res.status(500).json({
            message: "Lấy thông tin thất bại!"
        });
    }
};

// [PUT] /my-account/
module.exports.editInfor = async (req, res) => {
    const data = req.body;
    const id = req.accountId;
    try {
        if (data.email) {
            const emailExit = await Account.findOne({ email: data.email });
            if (emailExit) return res.status(400).json({ message: "Email đã tồn tại!" });
        }
        if (data.avatar) {
            const result = await uploadToCloudinaryHelper.uploader.upload(data.avatar);
            data.avatar = result.secure_url;
        }
        await Account.updateOne({ _id: id }, data);
        res.json({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        res.status(500).json({
            message: "Lấy thông tin thất bại!"
        });
    }
};

// [PUT] /my-account/password
module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        if(oldPassword === newPassword) return res.status(400).json({message: "Mật khẩu cũ không được trùng với mật khẩu mới!"});
        const myAccount = await Account.findOne({
            _id: req.accountId
        });
        const check = await bcrypt.compare(oldPassword, myAccount.password);
        if(!check)  return res.status(400).json({message: "Mật khẩu cũ không chính xác!"});
        
        const hashed = await bcrypt.hash(newPassword, 10);
        await Account.updateOne({_id: req.accountId}, {password: hashed});
        res.json("Đổi mật khẩu thành công!");
    } catch (error) {
        res.status(500).json({
            message: "Thất bại!"
        });
    }

};