const Account = require("../../models/account.model");
const bcrypt = require('bcrypt');
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    const find = {
        _id: { $ne: req.accountId }
    };
    const sort = {};

    try {
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

        // Phân trang
        const totalRecord = await Account.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allAccounts = await Account.find(find)
            .populate({ path: "role_id", select: "name" })
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);


        res.json({
            accounts: allAccounts,
            pageTotal: initPagination.totalPage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Lấy danh sách tài khoản thất bại!"
        });
    }
};

// [GET] /admin/accounts/:id
module.exports.getAccount = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId)
            .populate({ path: "role_id", select: "name" })
            .populate({ path: "createdBy.account_id", select: "fullName" })
            .populate({ path: "updatedBy.account_id", select: "fullName" });

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

// [POST] /admin/accounts
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

// [PUT] /admin/accounts/:id
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
            const emailExit = await Account.findOne({ email: data.email, _id: { $ne: accountId } });
            if (emailExit) return res.status(401).json("Email đã tồn tại!");
        }
        if (data.password) {
            const hashed = await bcrypt.hash(data.password, 10);
            data.password = hashed;
        }
        if (!data.role_id) {
            data.role_id = null;
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
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Cập nhật tài khoản thất bại!"
        });
    }
};

// [DELETE] /admin/accounts/:id
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

// [DELETE] /admin/accounts
module.exports.deleteManyAccount = async (req, res) => {
    const { ids } = req.body;
    try {
        await Account.deleteMany({ _id: { $in: ids } });
        res.json({
            success: true,
            message: "Xóa tài khoản thành công!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Xóa tài khoản thất bại!"
        });
    }
};
