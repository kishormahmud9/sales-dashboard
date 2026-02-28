import express from "express";
import { getPerformance } from "./performance.controller.js";
import { authenticateUser, canManageUsers } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Performance Detail: Admin roles only
router.get("/", authenticateUser, canManageUsers, getPerformance);

export default router;
