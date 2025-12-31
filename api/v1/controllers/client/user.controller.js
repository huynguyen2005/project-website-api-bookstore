const User = require("../../models/user.model");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");
const bcrypt = require('bcrypt');

//[GET] /my-profile
module.exports.getInfor = async (req, res) => {
    try {
        const myInfor = await User.findById(req.user.id).select("-password -status -createdAt -updatedAt");
        if (!myInfor) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        res.json({ myInfor });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//[PUT] /my-profile
module.exports.changeInfor = async (req, res) => {
    let data = req.body;
    delete data.password;
    try {
        if (data.email) {
            const emailExit = await User.findOne({ email: data.email, _id: { $ne: req.user.id } });
            if (emailExit) {
                return res.status(400).json({
                    success: false,
                    message: "Email đã tồn tại!"
                });
            }
        }
        if(data.avatar){
            const result = await uploadToCloudinaryHelper.uploader.upload(data.avatar);
            data.avatar = result.secure_url;
        }

        await User.findByIdAndUpdate(req.user.id, data);
        res.json({ message: "SUCCESS" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [PUT] /my-profile/password
module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const myUser = await User.findOne({
            _id: req.user.id
        }).select("password");

        const check = await bcrypt.compare(oldPassword, myUser.password);
        if (!check) return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: req.user.id }, { password: hashed });
        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server!"
        });
    }
};