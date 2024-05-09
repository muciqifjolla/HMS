const express = require("express");
const {
    FindAllUsers,
    FindSingleUser,
    AddUser,
    UpdateUser,
    DeleteUser
} = require("../controllers/UserController");

const router = express.Router();

router.get("/users", FindAllUsers);
router.get("/users/:id", FindSingleUser);
router.post("/users/create", AddUser);
router.put("/users/update/:id", UpdateUser);
router.delete("/users/delete/:id", DeleteUser);

module.exports = router;
