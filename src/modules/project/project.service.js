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

    // Handle initial follow-up timestamps
    if (rest.f01) rest.f01_at = new Date();
    if (rest.f02) rest.f02_at = new Date();
    if (rest.f03) rest.f03_at = new Date();

    // // Use a transaction: create project + increment query count atomically
    // const [project] = await prisma.$transaction([
    //     prisma.project.create({
    //         data: { employeeId, ...rest }
    //     }),
    //     prisma.user.update({
    //         where: { id: employeeId },
    //         data: { total_queries: { increment: 1 } }
    //     })
    // ]);
    const [project] = await prisma.$transaction([
    prisma.project.create({
        data: {
            ...rest,
            employee: {
                connect: { id: employeeId }
            }
        }
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

export const updateProject = async (id, updateData, requestingUser) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new DevBuildError("Project not found", 404);

    // 🛑 Restriction Logic for sales_member
    if (requestingUser.role === "sales_member") {
        const restrictedFields = [
            "employeeId", 
            "profileName", 
            "clientName", 
            "source", 
            "serviceLine", 
            "country"
        ];

        // 1. Prevent changing core project identity fields
        restrictedFields.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== project[field]) {
                throw new DevBuildError(`Members are not allowed to change the ${field}`, 403);
            }
        });

        // 2. Prevent changing quote if it's already set
        if (updateData.quote !== undefined && project.quote && updateData.quote !== project.quote) {
            throw new DevBuildError("Quote cannot be changed once provided", 403);
        }

        // 3. Prevent changing status if it's already "QUOTE_SENT"
        if (updateData.queryStatus !== undefined && project.queryStatus === "QUOTE_SENT" && updateData.queryStatus !== "QUOTE_SENT") {
            throw new DevBuildError("Status cannot be changed once 'quote sent' is selected", 403);
        }

        // 4. Prevent changing f01, f02, f03 if they are already true
        ["f01", "f02", "f03"].forEach((field, index) => {
            if (updateData[field] !== undefined && project[field] === true && updateData[field] !== true) {
                throw new DevBuildError(`Follow-up ${index + 1} cannot be changed once marked as done`, 403);
            }
        });

        // 5. Prevent changing conversationStatus if it's already "SOLD"
        if (updateData.conversationStatus !== undefined && project.conversationStatus === "SOLD" && updateData.conversationStatus !== "SOLD") {
            throw new DevBuildError("Conversation status cannot be changed once 'SOLD' is selected", 403);
        }
    }

    // If f01/f02/f03 is being set to true and it wasn't true before, set the timestamp
    ["f01", "f02", "f03"].forEach(field => {
        if (updateData[field] === true && !project[field]) {
            updateData[`${field}_at`] = new Date();
        }
    });

    return await prisma.project.update({ where: { id }, data: updateData });
};

export const deleteProject = async (id) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new DevBuildError("Project not found", 404);
    await prisma.project.delete({ where: { id } });
};
