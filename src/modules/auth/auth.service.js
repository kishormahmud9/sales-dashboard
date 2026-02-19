import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../lib/generateToken.js";
import DevBuildError from "../../lib/DevBuildError.js";

export const register = async (userData) => {
    const { name, email, password } = userData;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new DevBuildError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: { name, email, password: hashedPassword }
    });
};

export const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new DevBuildError("User not found", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new DevBuildError("Invalid credentials", 400);
    }

    return generateTokens(user);
};
