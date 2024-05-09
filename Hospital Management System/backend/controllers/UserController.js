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
        const { email, username, password, full_name, phone } = req.body;
        
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            full_name,
            phone,
        });
        res.json({ success: true, message: 'User added successfully', data: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { email, username, password, full_name, phone } = req.body;
        const updated = await User.update(
            { email, username, password, full_name, phone },
            { where: { user_id: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'User not found or not updated' });
            return;
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
};
