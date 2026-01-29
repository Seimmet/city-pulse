import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-123";

export type Role = "SUPER_ADMIN" | "PUBLISHER" | "EDITOR" | "READER";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string };
      role?: Role;
      cityId?: string | null;
    }
  }
}

export function parseContext(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  // 1. Try JWT
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      req.role = decoded.role as Role;
    } catch (e) {
      console.warn("Invalid JWT token");
    }
  }

  // 2. Fallback to headers (for Mock Auth or explicit overrides during dev)
  if (!req.role) {
    const roleHeader = req.header("x-user-role");
    if (roleHeader) {
      req.role = roleHeader as Role;
    } else {
      req.role = "READER";
    }
  }

  // 3. City Context
  const cityHeader = req.header("x-city-id");
  req.cityId = cityHeader || null;
  
  next();
}

export function requireRole(required: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== required) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function requireTenantScoped(req: Request, res: Response, next: NextFunction) {
  if (req.role === "SUPER_ADMIN") return next();
  if (!req.cityId) return res.status(400).json({ error: "city_id required" });
  next();
}
