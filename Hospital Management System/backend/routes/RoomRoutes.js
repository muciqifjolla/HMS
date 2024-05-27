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



router.get("/room", authenticateToken(['admin','doctor', 'receptionist']), FindAllRooms);
router.get("/room/:id", authenticateToken(['admin','doctor', 'receptionist']), FindSingleRoom);
router.post("/room/create", authenticateToken(['admin','doctor', 'receptionist']), AddRoom);
router.put("/room/update/:id", authenticateToken(['admin','doctor', 'receptionist']), UpdateRoom);
router.delete("/room/delete/:id", DeleteRoom);

module.exports = router;
