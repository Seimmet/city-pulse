import webpush from "web-push";
import { query } from "../db/pool";

// Initialize VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@citypulse.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID keys not set. Push notifications will not work.");
}

export async function sendPushToCitySubscribers(cityId: string, notification: { title: string; body: string; url: string }) {
  try {
    // Find all users with active subscriptions in this city who have push enabled
    const result = await query(
      `
      select distinct ps.endpoint, ps.keys
      from push_subscriptions ps
      join subscriptions s on ps.user_id = s.user_id
      join plans p on s.plan_id = p.id
      where p.city_id = $1
      and s.status = 'active'
      `,
      [cityId]
    );

    const subscriptions = result.rows;
    console.log(`Found ${subscriptions.length} subscribers to notify for city ${cityId}`);

    const payload = JSON.stringify(notification);

    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys
          },
          payload
        );
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription is invalid/expired, remove it
          await query("delete from push_subscriptions where endpoint = $1", [sub.endpoint]);
        } else {
          console.error("Error sending push:", err);
        }
      }
    });

    await Promise.all(promises);
  } catch (err) {
    console.error("Failed to send push notifications:", err);
  }
}
