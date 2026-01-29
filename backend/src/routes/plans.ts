import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool";
import { requireRole, requireTenantScoped } from "../middleware/rbac";
import Stripe from "stripe";

const router = Router();
// Initialize Stripe with mock key if not provided
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2023-10-16" as any,
  typescript: true,
});

// Middleware: Require PUBLISHER role and City Context
router.use(requireRole("PUBLISHER"));
router.use(requireTenantScoped);

const createPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price_amount: z.number().int().positive(), // in cents
  interval: z.enum(["month", "year"]),
});

// GET /publisher/plans - List plans for my city
router.get("/", async (req, res) => {
  try {
    const { cityId } = req;
    const result = await pool.query("select * from plans where city_id = $1 order by created_at desc", [cityId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /publisher/plans - Create new plan
router.post("/", async (req, res) => {
  try {
    const { cityId } = req;
    const body = createPlanSchema.parse(req.body);

    // 1. Create Product in Stripe (if real key exists)
    let stripePriceId = "price_mock_" + Date.now();
    
    // Only call Stripe if key is real-ish
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock")) {
       try {
         const product = await stripe.products.create({
           name: `${body.name} - ${cityId}`,
           description: body.description,
           metadata: { city_id: cityId! }
         });
         
         const price = await stripe.prices.create({
           product: product.id,
           unit_amount: body.price_amount,
           currency: 'usd',
           recurring: { interval: body.interval },
         });
         stripePriceId = price.id;
       } catch (stripeError) {
         console.error("Stripe Error:", stripeError);
         return res.status(500).json({ error: "Failed to create Stripe product" });
       }
    }

    // 2. Save to DB
    const result = await pool.query(
      `insert into plans (city_id, name, description, price_amount, interval, stripe_price_id)
       values ($1, $2, $3, $4, $5, $6) returning *`,
      [cityId, body.name, body.description || null, body.price_amount, body.interval, stripePriceId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /publisher/plans/:id - Deactivate plan
router.delete("/:id", async (req, res) => {
  try {
    const { cityId } = req;
    const { id } = req.params;
    
    // Verify ownership
    const plan = await pool.query("select id from plans where id = $1 and city_id = $2", [id, cityId]);
    if (plan.rows.length === 0) return res.status(404).json({ error: "Plan not found" });

    // We don't delete from DB to keep history, just set active = false (if we had that column, actually I added is_active)
    await pool.query("update plans set is_active = false where id = $1", [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
