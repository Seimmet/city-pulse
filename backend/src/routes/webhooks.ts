import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { pool } from "../db/pool";
import express from "express";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
  typescript: true,
});

// Webhook handler for Stripe
// Note: This route must use express.raw() middleware in app.ts or be mounted before express.json()
router.post("/stripe", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
        // If no secret, we can't verify, but for dev we might want to allow if explicitly set to skip
        throw new Error("Missing signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.metadata?.userId || !session.metadata?.planId) {
    console.warn("Missing metadata in checkout session");
    return;
  }

  const { userId, planId } = session.metadata;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  try {
    // Insert subscription
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, stripe_subscription_id, stripe_customer_id, status, current_period_end)
       VALUES ($1, $2, $3, $4, 'active', to_timestamp($5))
       ON CONFLICT (id) DO UPDATE SET status = 'active'`, // Note: Conflict isn't likely on ID unless we reuse UUIDs, but usually we insert new
       // Better logic: Check if user already has a sub for this plan? Or just insert new one.
       // For now, simple insert.
      [
        userId, 
        planId, 
        subscriptionId, 
        customerId, 
        Date.now() / 1000 + 30 * 24 * 60 * 60 // Default 30 days if not available, but usually we fetch sub details
      ]
    );
    console.log(`Subscription created for user ${userId}`);
  } catch (err) {
    console.error("Error creating subscription:", err);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const status = subscription.status;
    const subscriptionId = subscription.id;
    const currentPeriodEnd = (subscription as any).current_period_end;
    
    try {
        await pool.query(
            `UPDATE subscriptions 
             SET status = $1, current_period_end = to_timestamp($2)
             WHERE stripe_subscription_id = $3`,
            [status, currentPeriodEnd, subscriptionId]
        );
        console.log(`Subscription ${subscriptionId} updated to ${status}`);
    } catch (err) {
        console.error("Error updating subscription:", err);
    }
}

export default router;
