import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool";
import { requireRole } from "../middleware/rbac";

const router = Router();

const SubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string()
  })
});

// Subscribe to push notifications
router.post("/subscribe", requireRole("READER"), async (req, res) => {
  const parsed = SubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  
  const { endpoint, keys } = parsed.data;
  // @ts-ignore - user is attached by authenticateToken
  const userId = req.user?.userId;

  try {
    await query(
      `insert into push_subscriptions (user_id, endpoint, keys) 
       values ($1, $2, $3)
       on conflict (endpoint) do nothing`,
      [userId, endpoint, JSON.stringify(keys)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

router.get("/config", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;
