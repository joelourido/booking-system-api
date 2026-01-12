import express from "express";
import { BookingController } from "../controllers/bookingController.js";

const router = express.Router();

// POST api/bookings
router.post("/", BookingController.create);

// POST api/bookings/:id/confirm
router.post("/:id/confirm", BookingController.confirm);

// DELETE api/bookings/:id
router.delete("/:id", BookingController.cancel);

export default router;