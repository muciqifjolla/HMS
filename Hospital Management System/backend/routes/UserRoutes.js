const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');


const { loginUser, registerUser } = require("../controllers/AuthController"); // Import your login and register controllers
const {
    FindAllUsers,
    FindSingleUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    getUsersWithRoles
} = require("../controllers/UserController");


// Route definitions
router.get("/users", authenticateToken(['admin', 'doctor', 'patient']), getUsersWithRoles);
router.get("/users/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleUser);
router.post("/users/create", authenticateToken(['admin', 'doctor', 'patient']), AddUser); 
router.put("/users/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateUser); 
router.delete("/users/delete/:id", DeleteUser);
// router.get('/users/with-roles' , authenticateToken(['admin', 'doctor', 'patient']) , getUsersWithRoles);

// Route for user login
router.post("/login", loginUser);

// Route for user registration
router.post("/register", registerUser);

module.exports = router;
