import { Router } from "express";
import { login, register, logout } from "../controllers/UserController.js";
import {
  validateLogin,
  validateRegister,
} from "../middleware/validationMiddleware.js";

const router = Router();

router.route("/login").post(validateLogin, login);
router.route("/register").post(validateRegister, register);
router.route("/logout").get(logout);

export default router;
