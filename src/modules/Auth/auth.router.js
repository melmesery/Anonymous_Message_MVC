import { Router } from "express";
import validation from "../../middleware/validation.js";
import * as validators from "../Auth/auth.validation.js";
import * as authController from "./controller/auth.js";
const router = Router();

// Sign Up
router.get("/", authController.displaySignUp);
router.post(
  "/signup",
  validation(validators.signup, "/auth"),
  authController.signUp
);

//Login
router.get("/login", authController.displayLogin);
router.post(
  "/login",
  validation(validators.login, "/auth/login"),
  authController.login
);

export default router;
