const Carrier = require("../../models/carrier.model");

// [GET] /carriers
module.exports.getCarriers = async (req, res) => {
    try {
        const carriers = await Carrier.find({ status: "active" }).select("name");
        res.json({ carriers });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};