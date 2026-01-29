import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2023-10-16" as any,
  typescript: true,
});

// Public: List plans for a city
router.get("/city/:cityId/plans", async (req, res) => {
  try {
    const { cityId } = req.params;
    const result = await pool.query(
      "select * from plans where city_id = $1 and is_active = true order by price_amount asc",
      [cityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const checkoutSchema = z.object({
  planId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// Protected: Create Checkout Session
router.post("/checkout", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Must be logged in to subscribe" });
  
  try {
    const body = checkoutSchema.parse(req.body);
    
    // Get Plan
    const planRes = await pool.query("select * from plans where id = $1", [body.planId]);
    if (planRes.rows.length === 0) return res.status(404).json({ error: "Plan not found" });
    const plan = planRes.rows[0];

    // Create Stripe Session
    let sessionUrl = body.successUrl + "?session_id=mock_session_123";
    
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock")) {
       try {
         const session = await stripe.checkout.sessions.create({
           payment_method_types: ["card"],
           line_items: [{
             price: plan.stripe_price_id,
             quantity: 1,
           }],
           mode: "subscription",
           success_url: body.successUrl + "?session_id={CHECKOUT_SESSION_ID}",
           cancel_url: body.cancelUrl,
           customer_email: req.user.email,
           metadata: {
             userId: req.user.id,
             planId: plan.id,
             cityId: plan.city_id
           }
         });
         sessionUrl = session.url!;
       } catch (stripeError) {
         console.error("Stripe Checkout Error:", stripeError);
         return res.status(500).json({ error: "Failed to create checkout session" });
       }
    } else {
      // Mock logic: Simulate creating a subscription immediately for dev
      // In real life webhook does this, but for mock we might want to do it here or via a mock-success endpoint
      // For now just return URL, we'll handle mock completion later
    }

    res.json({ url: sessionUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
