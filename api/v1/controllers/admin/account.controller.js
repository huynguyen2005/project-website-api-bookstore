const Account = require("../../models/account.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");
const authHelper = require("../../../../helpers/auth");
let refreshTokens = [];

// [GET] /admin/account
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    const find = {};
    const sort = {};

    try {
        // Phân trang
        const totalRecord = await Account.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        // Tìm kiếm theo tên
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.fullName = objectSearch.regex;
        }

        // Lọc theo trạng thái
        if (status) {
            find.status = status;
        }

        // Sắp xếp
        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const allAccounts = await Account.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        if (allAccounts.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản nào!"
            });
        }

        res.json({
            accounts: allAccounts,
            pageTotal: initPagination.totalPage
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách tài khoản thất bại!"
        });
    }
};

// [GET] /admin/account/:id
module.exports.getAccount = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại!"
            });
        }

        res.json(account);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy thông tin tài khoản thất bại!"
        });
    }
};

// [POST] /admin/account/create
module.exports.createAccount = async (req, res) => {
    const data = req.body;

    try {
        const emailExit = await Account.findOne({ email: data.email });
        if (emailExit) return res.status(401).json("Email đã tồn tại!");
        if (data.password) {
            const hashed = await bcrypt.hash(data.password, 10);
            data.password = hashed;
        }
        if (!data.position) {
            data.position = await Account.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const account = new Account(data);
        await account.save();

        res.json({
            success: true,
            message: "Tạo tài khoản thành công!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Tạo tài khoản thất bại!"
        });
    }
};

// [PUT] /admin/account/edit/:id
module.exports.editAccount = async (req, res) => {
    const accountId = req.params.id;
    const data = req.body;

    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại!"
            });
        }
        if (data.email) {
            const emailExit = await Account.findOne({ email: data.email });
            if (emailExit) return res.status(401).json("Email đã tồn tại!");
        }
        if (data.password) {
            const hashed = await bcrypt.hash(data.password, 10);
            data.password = hashed;
        }

        await Account.updateOne({ _id: accountId }, {
            ...data,
            $push: {
                updatedBy: {
                    account_id: req.accountId,
                    updatedAt: Date.now()
                }
            }
        });

        res.json({
            success: true,
            message: "Cập nhật tài khoản thành công!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật tài khoản thất bại!"
        });
    }
};

// [DELETE] /admin/account/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại!"
            });
        }

        await Account.deleteOne({ _id: accountId });

        res.json({
            success: true,
            message: "Xóa tài khoản thành công!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa tài khoản thất bại!"
        });
    }
};

// [POST] /admin/account/login
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

    const { password, ...accountInfor } = account._doc;
    res.json({ accountInfor, accessToken });
};

// [POST] /admin/account/refresh-token
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

// [POST] /admin/account/logout
module.exports.logout = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.adminRefreshToken);
    res.clearCookie("adminRefreshToken");
    res.json({
        success: true,
        message: "Đăng xuất thành công"
    });
};



