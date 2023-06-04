const express = require("express");
const userController = require("../controllers/user.controller");
// comment out for simplify
// const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/users", userController.getUsers);


module.exports = router;