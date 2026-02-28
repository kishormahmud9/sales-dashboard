import * as projectService from "./project.service.js";

// Roles that can assign any employee when creating a project
// ✅ Create Project
export const createProject = async (req, res, next) => {
    try {
        const requestingUser = req.user;

        // Allow any employeeId from body, defaulting to req.user.id
        const employeeId = req.body.employeeId || requestingUser.id;

        const project = await projectService.createProject({
            ...req.body,
            employeeId
        });

        res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        next(error);
    }
};

// ✅ Get All Projects
export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// ✅ Get Project By ID
export const getProjectById = async (req, res, next) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// ✅ Update Project (All authenticated users)
export const updateProject = async (req, res, next) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        next(error);
    }
};

// ✅ Delete Project (superAdmin and sales_admin only)
export const deleteProject = async (req, res, next) => {
    try {
        await projectService.deleteProject(req.params.id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        next(error);
    }
};
