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
router.get("/users", authenticateToken(['admin', 'doctor', 'patient']), FindAllUsers); // Only admins can view all users
router.get("/users/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleUser); // Users can view their own profile
router.post("/users/create", authenticateToken(['admin', 'doctor', 'patient']), AddUser); // Only admins can create users
router.put("/users/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateUser); // Only admins can update users
router.delete("/users/delete/:id", DeleteUser); // Only admins can delete users
router.get('/users', getUsersWithRoles);

// Route for user login
router.post("/login", loginUser);

// Route for user registration
router.post("/register", registerUser);

module.exports = router;
