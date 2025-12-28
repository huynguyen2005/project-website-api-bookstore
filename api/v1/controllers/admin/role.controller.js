const Role = require("../../models/role.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.name = objectSearch.regex;
        }

        if (status) {
            find.status = status;
        }

        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const totalRecord = await Role.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allRole = await Role.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({
            roles: allRole,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy vai trò thất bại!"
        });
    }
};

//[GET] /admin/roles/list
module.exports.getListRole = async (req, res) => {
    try {
        const roles = await Role.find().select("name");
        res.json(roles);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách vai trò thất bại!"
        });
    }
}

// [GET] /admin/roles/:id
module.exports.getRole = async (req, res) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findById(roleId)
            .populate({ path: "createdBy.account_id", select: "fullName" })
            .populate({ path: "updatedBy.account_id", select: "fullName" });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Vai trò không tồn tại!"
            });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy vai trò thất bại!"
        });
    }
};

// [POST] /admin/roles
module.exports.createRole = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await Role.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const role = new Role(data);
        await role.save();
        res.json({
            success: true,
            message: "Thêm vai trò thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm vai trò thất bại!"
        });
    }
};

// [PUT] /admin/roles/:id
module.exports.editRole = async (req, res) => {
    const roleId = req.params.id;
    const data = req.body;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Vai trò không tồn tại!"
            });
        }

        await Role.updateOne({ _id: roleId }, {
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
            message: "Cập nhật vai trò thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật vai trò thất bại!"
        });
    }
};

// [DELETE] /admin/roles/:id
module.exports.deleteRole = async (req, res) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Vai trò không tồn tại!"
            });
        }

        await Role.deleteOne({ _id: roleId });
        res.json({
            success: true,
            message: "Xóa vai trò thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa vai trò thất bại!"
        });
    }
};

//[PUT] /admin/roles/permission
module.exports.editPermission = async (req, res) => {
    const datas = req.body;
    try {
        const updates = datas.map(data => ({
            updateOne: {
                filter: { _id: data.id },
                update: {
                    $set: {
                        permissions: data.permissions
                    },
                    $push: { updatedBy: { account_id: req.accountId, updatedAt: Date.now() } }
                }
            }
        }));

        await Role.bulkWrite(updates);

        res.json({
            success: true,
            message: "Cập nhật quyền thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật quyền thất bại!"
        });
    }
};

// [DELETE] /admin/roles
module.exports.deleteManyRole = async (req, res) => {
    const { ids } = req.body;
    try {
        await Role.deleteMany({ _id: { $in: ids } });
        res.json({
            success: true,
            message: "Xóa role thành công!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Xóa role thất bại!"
        });
    }
};