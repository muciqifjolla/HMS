const bcrypt = require('bcrypt');
const User = require('../models/User');

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
        res.json(users);
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
        const { email, username, password } = req.body;

        // Validate input fields
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
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

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same username already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        res.json({ success: true, message: 'User added successfully', data: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validate input fields
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
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

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { user_id: req.params.id } });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the password before updating it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updated = await User.update(
            { email, username, password: hashedPassword },
            { where: { user_id: req.params.id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: 'User not found or not updated' });
        }

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
