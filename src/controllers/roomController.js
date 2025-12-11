import { RoomModel } from '../models/roomModel.js';

export const RoomController = {
  // GET api/rooms
  async getAll(req, res) {
    try {
      const rooms = await RoomModel.getAll();
      return res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return res.status(500).json({ error: "Internal server error"});
    }
  },

  // GET api/rooms/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
      const room = await RoomModel.getById(id);
      if (!room) {
        return res.status(404).json({ error: "Room not found"});
      }

      return res.status(200).json(room);
    }  catch(error) {
      console.error("Error fetching room:", error);
      return res.status(500).json({ error: "Internal server error"})
    }            
  },

  // POST api/rooms
  async create(req, res) {
    try {
      const { room_name, room_capacity } = req.body;
      // Check room's room_name and capacity fields
      if (!room_capacity || !Number.isInteger(Number(room_capacity)) || room_capacity <= 0 ) {
        return res.status(400).json({ error: "Invalid or missing room capacity" });
      }
      if (!room_name || typeof room_name !== 'string' || room_name.trim() === "") {
       return res.status(400).json({ error: "Missing or invalid room name" });
      }

      const newRoom = await RoomModel.create({
        room_name: room_name,
        room_capacity: Number(room_capacity)
      });

      return res.status(201).json(newRoom);
    } catch (error) {
      // room_name field is unique, retrieve error message if a room with that name already exists.
      if (error.code === '23505') {
        return res.status(409).json({ error: "A room with this name already exists" });
      }
      console.error("Error creating room:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT api/rooms/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { room_name, room_capacity } = req.body;

      // Check room ID, name and capacity fields
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
      // Validation for name (only if provided)
      if ((room_name !== undefined)&&(!room_name || typeof room_name !== 'string' || room_name.trim() === "")) {
        return res.status(400).json({ error: "Missing or invalid room name" });
      }
      // Validation for capacity (only if provided)
      if (room_capacity !== undefined && (!Number.isInteger(Number(room_capacity)) || Number(room_capacity) <= 0)) {
        return res.status(400).json({ error: "Invalid room capacity" });
      }
      

      // Check if room exists
      const existing = await RoomModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Room not found" });
      }


      const updatedRoom = await RoomModel.update(id, { 
        room_name, 
        room_capacity 
      });

      return res.status(200).json(updatedRoom);
    } catch (error) {
      // room_name field is unique, retrieve error message if a room with that name already exists.
      if (error.code === '23505') {
        return res.status(409).json({ error: "A room with this name already exists" });
      }
      console.error("Error updating room:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },


  // DELETE api/rooms/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
      // Check if exists
      const existing = await RoomModel.getById(id);
      if(!existing) {
        return res.status(404).json({ error: "Room not found"});
      }

      await RoomModel.delete(id);

      return res.status(200).json({ message: "Room deleted successfully"});
    } catch (error) {
      console.error("Error deleting room:", error);
      return res.status(500).json({ error: "Internal server error"});
    }
  }
};