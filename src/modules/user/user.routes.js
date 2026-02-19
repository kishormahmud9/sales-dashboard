import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "./user.controller.js";
import { createUserSchema, updateUserSchema } from "./user.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticateUser, canManageUsers } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public/Self routes
router.get("/", authenticateUser, getAllUsers);
router.get("/:id", authenticateUser, getUserById);

// Admin only routes
router.post("/", authenticateUser, canManageUsers, validate(createUserSchema), createUser);
router.put("/:id", authenticateUser, canManageUsers, validate(updateUserSchema), updateUser);
router.delete("/:id", authenticateUser, canManageUsers, deleteUser);

export default router;
