import express from "express";
import { createProject, createProjectByAdmin, getAllProjects, getProjectById, updateProject, deleteProject } from "./project.controller.js";
import { createProjectSchema } from "./project.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticateUser, canDeleteProject } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getAllProjects);
router.get("/:id", authenticateUser, getProjectById);

// For sales_member
router.post("/", authenticateUser, validate(createProjectSchema), createProject);


// For sales_admin
router.post("/admin", authenticateUser, canDeleteProject, validate(createProjectSchema), createProjectByAdmin);


router.put("/:id", authenticateUser, updateProject);              // All authenticated users
router.delete("/:id", authenticateUser, canDeleteProject, deleteProject); // superAdmin + sales_admin only

export default router;
