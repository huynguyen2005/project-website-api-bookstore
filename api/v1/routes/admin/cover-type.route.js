const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/cover-type.controller");

router.get("/", controller.index);
router.get("/list", controller.getListCoverType);
router.post("/", controller.createCoverType);
router.get("/:id", controller.getCoverType);
router.put("/:id", controller.editCoverType);
router.delete("/:id", controller.deleteCoverType);

module.exports = router;
