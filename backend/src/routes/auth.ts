import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-123";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  role: z.enum(["READER", "PUBLISHER", "SUPER_ADMIN"]).optional().default("READER"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const body = signupSchema.parse(req.body);
    
    // Check existing
    const existing = await pool.query("select id from users where email = $1", [body.email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(body.password, 10);
    
    const result = await pool.query(
      "insert into users (email, password_hash, full_name, role) values ($1, $2, $3, $4) returning id, email, role, full_name",
      [body.email, hash, body.fullName || null, body.role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    
    const result = await pool.query("select * from users where email = $1", [body.email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(body.password, user.password_hash);
    
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    // If publisher, get city_id
    let cityId = null;
    if (user.role === 'PUBLISHER') {
      const pubRes = await pool.query("select city_id from publishers where owner_id = $1", [user.id]);
      if (pubRes.rows.length > 0) {
        cityId = pubRes.rows[0].city_id;
      }
    }

    res.json({ 
      user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name, city_id: cityId }, 
      token 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /auth/me
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const result = await pool.query("select id, email, role, full_name from users where id = $1", [decoded.id]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = result.rows[0];
     // If publisher, get city_id
    let cityId = null;
    if (user.role === 'PUBLISHER') {
      const pubRes = await pool.query("select city_id from publishers where owner_id = $1", [user.id]);
      if (pubRes.rows.length > 0) {
        cityId = pubRes.rows[0].city_id;
      }
    }

    res.json({ user: { ...user, city_id: cityId } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
