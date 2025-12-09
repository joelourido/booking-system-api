import express from 'express';
import { pool } from './src/db.js';
import dotenv from 'dotenv';
import movieRoutes from "./src/routes/movieRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/rooms", roomRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));