
import { Router } from "express";
import { pool } from "../db/pool";
import { requireRole } from "../middleware/rbac";

const router = Router();

// GET /editions/:id - Public access (or Subscriber only later)
router.get("/editions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // In Phase 1, we allow anyone to read. In future, check subscription.
    const result = await pool.query(
      `select e.*, p.name as publisher_name, c.name as city_name
       from editions e
       join publishers p on e.publisher_id = p.id
       join cities c on p.city_id = c.id
       where e.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Edition not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
