const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/cover-type.controller");

router.get("/", controller.index);
router.get("/list", controller.getListCoverType);
router.post("/create", controller.createCoverType);
router.get("/:id", controller.getCoverType);
router.put("/edit/:id", controller.editCoverType);
router.delete("/delete/:id", controller.deleteCoverType);

module.exports = router;
