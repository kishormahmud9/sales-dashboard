import * as dashboardService from "./dashboard.service.js";

// ✅ GET /api/v1/dashboard/my-stats
// Access: All authenticated users
// Query Params: month, year
export const getMyDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;
        const data = await dashboardService.getMemberDashboardData(userId, month, year);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ GET /api/v1/dashboard/executive-stats
// Access: superAdmin, sales_admin, operation_admin
// Query Params: month, year
export const getExecutiveDashboard = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        const data = await dashboardService.getExecutiveDashboardData(month, year);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
