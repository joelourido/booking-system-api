import express from "express";
import { SessionController } from "../controllers/sessionController.js";

const router = express.Router();

// GET api/sessions
router.get("/", SessionController.getAll);

// GET api/sessions/:id
router.get("/:id", SessionController.getById);

// POST api/sessions
router.post("/", SessionController.create);

// PUT api/sessions/:id
router.put("/:id", SessionController.update);

// DELETE api/sessions/:id
router.delete("/:id", SessionController.delete);

export default router;