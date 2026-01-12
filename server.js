import express from 'express';
import dotenv from 'dotenv';
import movieRoutes from "./src/routes/movieRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js"
import sessionRoutes from "./src/routes/sessionRoutes.js"
import bookingRoutes from "./src/routes/bookingRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));