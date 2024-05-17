const Ratingg = require('../models/Rating');

const FindAllRating = async (req, res) => {
    try {
        const rating = await Ratingg.findAll();
        res.json(rating);
    } catch (error) {
        console.error('Error fetching all ratings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleRating = async (req, res) => {
    try {
        const rating = await Ratingg.findByPk(req.params.id);
        if (!rating) {
            res.status(404).json({ error: 'Rating not found' });
            return;
        }
        res.json(rating);
    } catch (error) {
        console.error('Error fetching single rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddRating = async (req, res) => {
    try {
        const { Emp_ID, Rating, Comments, Date } = req.body;

        // Validation
        if (!Emp_ID || !Rating || !Comments || !Date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (Emp_ID < 1) {
            return res.status(400).json({ error: 'Staff ID cannot be less than 1' });
        }
        if (Comments.length > 30) {
            return res.status(400).json({ error: 'Comments must be maximum 30 characters long' });
        }

        // Check if a rating already exists for the employee
        const existingRating = await Ratingg.findOne({ where: { Emp_ID } });
        if (existingRating) {
            // If the employee already has a rating, return an error
            return res.status(400).json({ error: `Employee ${Emp_ID} has already been rated` });
        }

        // Assuming Ratingg is the Sequelize model for your Rating table
        const newRating = await Ratingg.create({
            Emp_ID,
            Rating,
            Comments,
            Date,
        });
        res.json({ success: true, message: 'Rating added successfully', data: newRating });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const UpdateRating = async (req, res) => {
    try {
        const { Emp_ID, Rating, Comments, Date } = req.body;

        // Validation
        if (!Emp_ID || !Rating || !Comments || !Date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if(Emp_ID<1){
            return res.status(400).json({ error: 'Staff ID cannot be less than 1' });
        }
        if (Comments.length > 30) {
            return res.status(400).json({ error: 'Comments must be maximum 30 characters long' });
        }

        const updated = await Ratingg.update(
            { Emp_ID, Rating, Comments, Date },
            { where: { Rating_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Rating not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Rating updated successfully' });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const DeleteRating = async (req, res) => {
    try {
        const deleted = await Ratingg.destroy({
            where: { Rating_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Rating not found' });
            return;
        }
        res.json({ success: true, message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Error deleting insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllRating,
    FindSingleRating,
    AddRating,
    UpdateRating,
    DeleteRating,
};
