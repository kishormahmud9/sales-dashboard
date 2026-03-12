import bcrypt from "bcrypt";
import DevBuildError from "../../lib/DevBuildError.js";

export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new DevBuildError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new DevBuildError("Incorrect current password", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return { message: "Password updated successfully" };
};
