const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Role = require('../models/Role');


const saltRounds = 10;

const FindAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUsersWithRoles = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: UserRole,
                include: [{
                    model: Role,
                    attributes: ['role_name']
                }]
            }],
            attributes: ['user_id', 'username', 'email']
        });

        // Map users to include roles
        const usersWithRoles = users.map(user => ({
            ...user.toJSON(),
            role: user.UserRoles.length > 0 ? user.UserRoles[0].Role.role_name : 'No Role'
        }));

        console.log("Fetched Users with Roles:", usersWithRoles); // Debug log

        res.json(usersWithRoles);
    } catch (error) {
        console.error('Error fetching users with roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const FindSingleUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching single user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        // Validate input fields
        if (!email || !username || !password || !role) {
            console.error('Validation error: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Validation error: Invalid email address');
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Validate username length
        if (username.length < 3) {
            console.error('Validation error: Username must be at least 3 characters long');
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        // Validate password length
        if (password.length < 6) {
            console.error('Validation error: Password must be at least 6 characters long');
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.error('Validation error: User with the same username already exists');
            return res.status(400).json({ error: 'User with the same username already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        // Find the role by name
        const userRole = await Role.findOne({ where: { role_name: role } });
        if (!userRole) {
            console.error('Validation error: Invalid role');
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Assign the role to the user
        await UserRole.create({
            user_id: newUser.user_id,
            role_id: userRole.role_id,
        });

        res.json({ success: true, message: 'User added successfully', data: newUser });
    } catch (error) {
        console.error('Error adding user:', error.message, error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        // Validate input fields
        if (!email || !username || !role) {
            return res.status(400).json({ error: 'Email, username, and role are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Validate username length
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { user_id: req.params.id } });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        const updatedUser = await User.update(
            { email, username },
            { where: { user_id: req.params.id } }
        );

        // Find the role by name
        const userRole = await Role.findOne({ where: { role_name: role } });
        if (!userRole) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Update user's role
        await UserRole.update(
            { role_id: userRole.role_id },
            { where: { user_id: req.params.id } }
        );

        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const DeleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { user_id: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllUsers,
    FindSingleUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    getUsersWithRoles,
};
