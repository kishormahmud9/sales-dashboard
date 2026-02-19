import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "./project.controller.js";
import { createProjectSchema } from "./project.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticateUser, canDeleteProject } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getAllProjects);
router.get("/:id", authenticateUser, getProjectById);
router.post("/", authenticateUser, validate(createProjectSchema), createProject);
router.put("/:id", authenticateUser, updateProject);              // All authenticated users
router.delete("/:id", authenticateUser, canDeleteProject, deleteProject); // superAdmin + sales_admin only

export default router;
