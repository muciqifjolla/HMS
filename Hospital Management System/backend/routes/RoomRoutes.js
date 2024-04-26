const express = require("express");
const {
    FindAllRooms,
    FindSingleRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
} = require("../controllers/RoomController");

const router = express.Router();

router.get("/room", FindAllRooms);
router.get("/room/:id", FindSingleRoom);
router.post("/room/create", AddRoom);
router.put("/room/update/:id", UpdateRoom);
router.delete("/room/delete/:id", DeleteRoom);

module.exports = router;
