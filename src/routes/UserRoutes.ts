import { Router } from "express";
import UserController from "../controllers/UserController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import ValidationMiddleware from "../middlewares/ValidationMiddleware";

const router = Router();

// Public routes
router.post(
  "/register",
  UserController.registerValidation,
  ValidationMiddleware.validate,
  UserController.register.bind(UserController) // bind `this`
);

router.post(
  "/login",
  UserController.loginValidation,
  ValidationMiddleware.validate,
  UserController.login.bind(UserController) // bind `this`
);

// Protected routes
router.get(
  "/profile",
  AuthMiddleware.authenticate(),
  UserController.getProfile.bind(UserController)
);
router.get(
  "/admin",
  AuthMiddleware.authenticate("admin"),
  UserController.adminDashboard.bind(UserController)
);

export default router;
