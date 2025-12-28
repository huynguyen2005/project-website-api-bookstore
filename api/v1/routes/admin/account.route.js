const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);
router.post("/", controller.createAccount);
router.get("/:id", controller.getAccount);
router.put("/:id", controller.editAccount);
router.delete("/:id", controller.deleteAccount);
router.delete("/", controller.deleteManyAccount);

module.exports = router;
