import express from "express";
import { registerUser, loginUser, refreshToken } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh-token", refreshToken);

export default router;
