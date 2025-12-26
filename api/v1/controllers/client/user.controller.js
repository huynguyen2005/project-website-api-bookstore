const User = require("../../models/user.model");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");

//[GET] /users/my-profile
module.exports.getInfor = async (req, res) => {
    try {
        const myInfor = await User.findById(req.user.id).select("-password -status -createdAt -updatedAt");
        if (!myInfor) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        res.json({ myInfor });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//[PUT] /users/my-profile
module.exports.changeInfor = async (req, res) => {
    let { email, fullName, phone, avatar, address, birthday } = req.body;
    try {
        if (email) {
            const emailExit = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (emailExit) {
                return res.status(400).json({
                    success: false,
                    message: "Email đã tồn tại!"
                });
            }
        }
        if(avatar){
            const result = await uploadToCloudinaryHelper.uploader.upload(avatar);
            avatar = result.secure_url;
        }

        await User.findByIdAndUpdate(req.user.id, { email, fullName, phone, avatar, address, birthday });
        res.json({ message: "SUCCESS" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};