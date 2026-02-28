import prisma from "../../config/prisma.js";

// ✅ Get all notifications (Global visibility)
export const getUserNotifications = async () => {
    return await prisma.notification.findMany({
        orderBy: { createdAt: "desc" }
    });
};

// ✅ Mark a notification as read
export const markAsRead = async (id) => {
    return await prisma.notification.update({
        where: { id },
        data: { isRead: true }
    });
};

// ✅ Create a notification (Internal helper)
export const createInternalNotification = async (data) => {
    return await prisma.notification.create({
        data
    });
};

// ✅ Delete a notification (Global)
export const deleteNotification = async (id) => {
    return await prisma.notification.delete({
        where: { id }
    });
};
