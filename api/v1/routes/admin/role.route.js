const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.put("/permission", controller.editPermission);
router.get("/", controller.index);
router.post("/create", controller.createRole);
router.get("/:id", controller.getRole);
router.put("/edit/:id", controller.editRole);
router.delete("/delete/:id", controller.deleteRole);

module.exports = router;
