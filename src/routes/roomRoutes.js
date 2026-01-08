import express from "express";
import { RoomController } from "../controllers/roomController.js";
import { SeatController } from "../controllers/seatController.js";

const router = express.Router();

// GET api/rooms
router.get("/", RoomController.getAll);

// GET api/rooms/:id
router.get("/:id", RoomController.getById);

// POST api/rooms
router.post("/", RoomController.create);

// PUT api/rooms/:id
router.put("/:id", RoomController.update);

// DELETE api/rooms/:id
router.delete("/:id", RoomController.delete);

// Seats (sub-resource of rooms)

// GET api/rooms/:roomId/seats
router.get("/:roomId/seats", SeatController.getByRoom);

// POST api/rooms/:roomId/seats
router.post("/:roomId/seats", SeatController.bulkCreate);

// DELETE api/rooms/:roomId/seats
router.delete("/:roomId/seats", SeatController.deleteByRoom);

export default router;