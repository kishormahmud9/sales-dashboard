import express from "express";
import { changePasswordController } from "./change_password.controller.js";
import { changePasswordSchema } from "./change_password.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, validate(changePasswordSchema), changePasswordController);

export default router;
