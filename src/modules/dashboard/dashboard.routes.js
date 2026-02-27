import express from "express";
import { getMyDashboard, getExecutiveDashboard } from "./dashboard.controller.js";
import { authenticateUser, canManageUsers } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Executive Consolidated Stats: Admin roles only
router.get("/executive-stats", authenticateUser, canManageUsers, getExecutiveDashboard);

// My Dashboard: All authenticated users
router.get("/my-stats", authenticateUser, getMyDashboard);

export default router;
