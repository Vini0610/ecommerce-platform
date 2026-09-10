const express = require("express");
const validate = require("../middleware/validator.middleware");

const router = express.Router();

const { getUserById, getUsers, createUser} = require("../controllers/user.controller")

const {createUserSchema} = require("../validators/user.validator")

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

router.post("/user", validate(createUserSchema), createUser);

module.exports = router;