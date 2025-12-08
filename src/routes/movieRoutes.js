import express from "express";
import { MovieController } from "../controllers/movieController.js";

const router = express.Router();

// GET api/movies
router.get("/", MovieController.getAll);

// GET api/movies/:id
router.get("/:id", MovieController.getById);

// POST api/movies
router.post("/", MovieController.create);

// PUT api/movies/:id
router.put("/:id", MovieController.update);

// DELETE api/movies/:id
router.delete("/:id", MovieController.delete);

export default router;