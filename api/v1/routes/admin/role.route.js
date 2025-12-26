const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.put("/permission", controller.editPermission);
router.get("/", controller.index);
router.get("/list", controller.getListRole); 
router.post("/", controller.createRole);
router.get("/:id", controller.getRole);
router.put("/:id", controller.editRole);
router.delete("/:id", controller.deleteRole);

module.exports = router;
