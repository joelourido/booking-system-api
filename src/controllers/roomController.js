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
      if (isNaN(id)) {
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
      const { capacity } = req.body;
      if (!capacity || isNaN(Number(capacity))) {
        return res.status(400).json({ error: "Invalid or missing capacity" });
      }

      const newRoom = await RoomModel.create({
        capacity: Number(capacity)
      });

      return res.status(201).json(newRoom);
    } catch (error) {
      console.error("Error creating room:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT api/rooms/:id
  async update(req, res) {
    try {
    const id = Number(req.params.id);
    const updates = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid room ID" });
    }

    // Check if room exists
    const existing = await RoomModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Room not found" });
    }
    

    const updatedRoom = await RoomModel.update(id, updates);

    return res.status(200).json(updatedRoom);
    } catch (error) {
      console.error("Error updating room:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE api/rooms/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
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