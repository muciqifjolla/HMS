// routes/UserRoutes.js

const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const { loginUser, registerUser } = require("../controllers/AuthController"); // Import your login and register controllers
const {
    FindAllUsers,
    FindSingleUser,
    AddUser,
    UpdateUser,
    DeleteUser
} = require("../controllers/UserController");

// Define middleware to check user roles
const isAdmin = requireRole("admin");
const isUser = requireRole("user");

// Route definitions
router.get("/users", isAdmin, FindAllUsers); // Only admins can view all users
router.get("/users/:id", authenticateToken, isUser, FindSingleUser); // Users can view their own profile
router.post("/users/create", isAdmin, AddUser); // Only admins can create users
router.put("/users/update/:id", authenticateToken, isAdmin, UpdateUser); // Only admins can update users
router.delete("/users/delete/:id", authenticateToken, isAdmin, DeleteUser); // Only admins can delete users

// Route for user login
router.post("/login", loginUser);

// Route for user registration
router.post("/register", registerUser);

module.exports = router;
