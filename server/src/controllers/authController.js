import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/appUserModel.js";


const JWT_SECRET = process.env.JWT_SECRET;

export const AuthController = {
  
  // POST /auth/register
  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email is already in use" });
      }

      // Hash the password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Save the user to the DB
      const user = await UserModel.create({ 
        email, 
        password_hash, 
        full_name 
      });

      // Generate a 24h token immediately so they are logged in
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        user,
        token
      });

    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare passwords with the hashed one stored in db
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate 24h token
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token
      });

    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};