import * as dashboardService from "./dashboard.service.js";

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

// ✅ GET /api/v1/dashboard/executive-stats
// Access: superAdmin, sales_admin, operation_admin
export const getExecutiveDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getExecutiveDashboardData();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
