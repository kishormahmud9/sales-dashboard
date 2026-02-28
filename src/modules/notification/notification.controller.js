import * as notificationService from "./notification.service.js";

// ✅ GET /api/v1/notifications
export const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getUserNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

// ✅ PATCH /api/v1/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await notificationService.markAsRead(id);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        next(error);
    }
};
// ✅ DELETE /api/v1/notifications/:id
export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        await notificationService.deleteNotification(id);
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        next(error);
    }
};
