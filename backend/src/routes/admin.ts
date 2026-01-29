import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { query, pool } from "../db/pool";
import { requireRole } from "../middleware/rbac";

const router = Router();

const CitySchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2)
});

const CityUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  status: z.enum(["active", "inactive"]).optional()
});

router.post("/cities", requireRole("SUPER_ADMIN"), async (req, res) => {
  const parsed = CitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { name, country } = parsed.data;
  const result = await query(
    `insert into cities (name, country) values ($1, $2) returning id, name, country, status`,
    [name, country]
  );
  res.json(result.rows[0]);
});

router.get("/cities", requireRole("SUPER_ADMIN"), async (_req, res) => {
  const result = await query(`select id, name, country, status from cities order by name asc`);
  res.json(result.rows);
});

router.patch("/cities/:id", requireRole("SUPER_ADMIN"), async (req, res) => {
  const id = req.params.id;
  const parsed = CityUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const fields = parsed.data;
  const updates: string[] = [];
  const params: any[] = [];
  let i = 1;
  for (const [key, value] of Object.entries(fields)) {
    updates.push(`${key} = $${i++}`);
    params.push(value);
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: "No changes provided" });
  }
  params.push(id);
  const sql = `update cities set ${updates.join(", ")} where id = $${i} returning id, name, country, status`;
  const result = await query(sql, params);
  if (result.rowCount === 0) return res.status(404).json({ error: "City not found" });
  res.json(result.rows[0]);
});

router.delete("/cities/:id", requireRole("SUPER_ADMIN"), async (req, res) => {
  const id = req.params.id;
  const result = await query(`delete from cities where id = $1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "City not found" });
  res.json({ ok: true });
});

const PublisherSchema = z.object({
  city_id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  license_status: z.enum(["active", "suspended", "expired"]).default("active")
});

const PublisherUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  license_status: z.enum(["active", "suspended", "expired"]).optional()
});

router.post("/publishers", requireRole("SUPER_ADMIN"), async (req, res) => {
  const parsed = PublisherSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { city_id, name, email, password, license_status } = parsed.data;
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if city already has a publisher
    const cityCheck = await client.query("select id from publishers where city_id = $1", [city_id]);
    if (cityCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "City already has a publisher" });
    }

    // 2. Check if email exists
    const emailCheck = await client.query("select id from users where email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Email already registered" });
    }

    // 3. Create User
    const hash = await bcrypt.hash(password, 10);
    const userRes = await client.query(
      "insert into users (email, password_hash, role, full_name) values ($1, $2, 'PUBLISHER', $3) returning id",
      [email, hash, name]
    );
    const userId = userRes.rows[0].id;

    // 4. Create Publisher linked to User
    const pubRes = await client.query(
      `insert into publishers (city_id, name, license_status, owner_id) values ($1, $2, $3, $4)
       returning id, city_id, name, license_status`,
      [city_id, name, license_status, userId]
    );

    await client.query("COMMIT");
    res.json(pubRes.rows[0]);
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

router.get("/publishers", requireRole("SUPER_ADMIN"), async (_req, res) => {
  const result = await query(
    `select p.id, p.name, p.license_status, c.id as city_id, c.name as city_name
     from publishers p join cities c on c.id = p.city_id
     order by c.name asc`
  );
  type Row = {
    id: string;
    name: string;
    license_status: string;
    city_id: string;
    city_name: string;
  };
  const rows = result.rows as Row[];
  res.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      license_status: r.license_status,
      city: { id: r.city_id, name: r.city_name }
    }))
  );
});

router.patch("/publishers/:id", requireRole("SUPER_ADMIN"), async (req, res) => {
  const id = req.params.id;
  const parsed = PublisherUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const fields = parsed.data;
  const updates: string[] = [];
  const params: any[] = [];
  let i = 1;
  for (const [key, value] of Object.entries(fields)) {
    updates.push(`${key} = $${i++}`);
    params.push(value);
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: "No changes provided" });
  }
  params.push(id);
  const sql = `update publishers set ${updates.join(", ")} where id = $${i} returning id, city_id, name, license_status`;
  const result = await query(sql, params);
  if (result.rowCount === 0) return res.status(404).json({ error: "Publisher not found" });
  res.json(result.rows[0]);
});

export default router;
