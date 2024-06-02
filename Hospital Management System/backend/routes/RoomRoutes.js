const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    FindAllRooms,
    FindSingleRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
} = require("../controllers/RoomController");



router.get("/room", authenticateToken(['admin', 'doctor', 'patient']), FindAllRooms);
router.get("/room/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleRoom);
router.post("/room/create", authenticateToken(['admin', 'doctor', 'patient']), AddRoom);
router.put("/room/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateRoom);
router.delete("/room/delete/:id", DeleteRoom);

module.exports = router;
