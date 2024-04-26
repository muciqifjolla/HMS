const Room = require('../models/Room');

const FindAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.json(room);
    } catch (error) {
        console.error('Error fetching single room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddRoom = async (req, res) => {
    try {
        const { Room_type, Patient_ID, Room_cost } = req.body;
        
        const newRoom = await Room.create({
            Room_type,
            Patient_ID,
            Room_cost,
        });
        res.json({ success: true, message: 'Room added successfully', data: newRoom });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateRoom = async (req, res) => {
    try {
        const { Room_type, Patient_ID, Room_cost } = req.body;
        const updated = await Room.update(
            { Room_type, Patient_ID, Room_cost },
            { where: { Room_ID : req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Room not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteRoom = async (req, res) => {
    try {
        const deleted = await Room.destroy({
            where: { Room_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllRooms,
    FindSingleRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
};
