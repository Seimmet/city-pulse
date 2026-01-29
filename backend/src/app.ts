import express from "express";
import cors from "cors";
import helmet from "helmet";
import { parseContext } from "./middleware/rbac";
import adminRoutes from "./routes/admin";
import publisherRoutes from "./routes/publisher";
import readerRoutes from "./routes/reader";
import authRoutes from "./routes/auth";
import plansRoutes from "./routes/plans";
import subscriptionRoutes from "./routes/subscriptions";
import notificationRoutes from "./routes/notifications";
import webhookRoutes from "./routes/webhooks";

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "*", 
  credentials: true 
}));

// Webhooks must be mounted BEFORE express.json() to access raw body
app.use("/webhooks", webhookRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// In production (Vercel), we don't use local uploads, but for dev fallback:
app.use('/uploads', express.static('uploads'));

app.use(parseContext);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/", (_req, res) => {
  res.json({ message: "City Pulse API is running" });
});

const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/publisher", publisherRoutes);
apiRouter.use("/publisher/plans", plansRoutes);
apiRouter.use("/subscriptions", subscriptionRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/", readerRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
