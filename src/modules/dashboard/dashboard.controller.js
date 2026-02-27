import * as dashboardService from "./dashboard.service.js";

// ✅ GET /api/v1/dashboard/stats
// Access: superAdmin, sales_admin, operation_admin
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

// ✅ GET /api/v1/dashboard/performance
// Access: superAdmin, sales_admin only
export const getUserPerformance = async (req, res, next) => {
    try {
        const performance = await dashboardService.getUserPerformance();
        res.status(200).json(performance);
    } catch (error) {
        next(error);
    }
};

// ✅ GET /api/v1/dashboard/my-stats
// Access: All authenticated users
export const getMyDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await dashboardService.getMemberDashboardData(userId);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
