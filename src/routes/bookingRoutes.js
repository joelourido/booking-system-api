import express from "express";
import { BookingController } from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST api/bookings
router.post("/", authenticateToken, BookingController.create);

// POST api/bookings/:id/confirm
router.post("/:id/confirm", authenticateToken, BookingController.confirm);

// DELETE api/bookings/:id
router.delete("/:id", authenticateToken, BookingController.cancel);

// GET api/bookings
router.get("/", authenticateToken, BookingController.list);

export default router;