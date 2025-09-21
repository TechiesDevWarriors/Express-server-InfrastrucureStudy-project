import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { username: string; role: string };
}

export default class AuthMiddleware {
  static authenticate(requiredRole?: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;

        if (requiredRole && decoded.role !== requiredRole) {
          return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }

        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).json({ message: "Invalid token" });
      }
    };
  }
}
