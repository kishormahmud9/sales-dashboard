import express from "express";
import { registerUser, loginUser, refreshToken, forgotPassword, verifyOtp, resetPassword } from "./auth.controller.js";
import { registerSchema, loginSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh-token", refreshToken);

// Forgot Password Flow
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
