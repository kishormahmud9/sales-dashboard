import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import DevBuildError from "../../lib/DevBuildError.js";

export const getAll = async () => {
    return await prisma.user.findMany();
};

export const getById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new DevBuildError("User not found", 404);
    return user;
};

export const create = async (userData) => {
    const { name, email, password, role, status } = userData;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new DevBuildError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: { name, email, password: hashedPassword, role, status }
    });
};

export const update = async (id, updateData) => {
    return await prisma.user.update({
        where: { id },
        data: updateData
    });
};

export const remove = async (id) => {
    return await prisma.user.delete({ where: { id } });
};
