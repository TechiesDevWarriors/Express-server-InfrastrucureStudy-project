import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import HashUtil from "../utils/HashUtil";

interface User {
  username: string;
  password: string;
  role: string;
}

export default class UserController {
  private static users: User[] = [];

  static registerValidation = [
    body("username").isString().notEmpty(),
    body("password").isString().isLength({ min: 6 }),
    body("role").optional().isIn(["user", "admin"])
  ];

  static loginValidation = [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty()
  ];

  static async register(req: Request, res: Response) {
    const { username, password, role } = req.body;
    const hashedPassword = await HashUtil.hashPassword(password);
    this.users.push({ username, password: hashedPassword, role: role || "user" });
    res.status(201).json({ message: "User registered successfully" });
  }

  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = this.users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await HashUtil.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  }

  static getProfile(req: any, res: Response) {
    res.json({ message: "Profile data", user: req.user });
  }

  static adminDashboard(req: any, res: Response) {
    res.json({ message: "Admin dashboard", user: req.user });
  }
}
