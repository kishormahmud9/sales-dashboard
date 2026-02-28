import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import performanceRoutes from "../modules/performance/performance.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/performance", performanceRoutes);

export default router;
