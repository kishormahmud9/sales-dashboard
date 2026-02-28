import express from "express";
import { getMyNotifications, markNotificationRead } from "./notification.controller.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Get unread notifications
router.get("/", authenticateUser, getMyNotifications);

// Mark as read
router.patch("/:id/read", authenticateUser, markNotificationRead);

export default router;
