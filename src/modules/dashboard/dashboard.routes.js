import express from "express";
import { getDashboardStats, getUserPerformance } from "./dashboard.controller.js";
import { authenticateUser, canManageUsers, authorize } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Stats: superAdmin, sales_admin, operation_admin
router.get("/stats", authenticateUser, canManageUsers, getDashboardStats);

// Performance: superAdmin and sales_admin only
router.get("/performance", authenticateUser, authorize(["superAdmin", "sales_admin"]), getUserPerformance);

export default router;
