import express from "express";
import { RoomController } from "../controllers/roomController.js";

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

export default router;