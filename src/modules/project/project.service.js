import prisma from "../../config/prisma.js";
import DevBuildError from "../../lib/DevBuildError.js";

/**
 * Creates a project and increments the assigned employee's total_queries.
 * Uses a Prisma transaction to ensure data consistency.
 */
export const createProject = async (projectData) => {
    const { employeeId, ...rest } = projectData;

    // Verify the employee exists
    const employee = await prisma.user.findUnique({ where: { id: employeeId } });
    if (!employee) {
        throw new DevBuildError("Employee not found", 404);
    }

    // Use a transaction: create project + increment query count atomically
    const [project] = await prisma.$transaction([
        prisma.project.create({
            data: { employeeId, ...rest }
        }),
        prisma.user.update({
            where: { id: employeeId },
            data: { total_queries: { increment: 1 } }
        })
    ]);

    return project;
};

export const getAllProjects = async () => {
    return await prisma.project.findMany({
        include: { employee: true, soldBy: true }
    });
};

export const getProjectById = async (id) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: { employee: true, soldBy: true }
    });
    if (!project) throw new DevBuildError("Project not found", 404);
    return project;
};

export const updateProject = async (id, updateData) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new DevBuildError("Project not found", 404);
    return await prisma.project.update({ where: { id }, data: updateData });
};

export const deleteProject = async (id) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new DevBuildError("Project not found", 404);
    await prisma.project.delete({ where: { id } });
};
