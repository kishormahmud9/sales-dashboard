import * as performanceService from "./performance.service.js";

// ✅ GET /api/v1/performance
// Access: superAdmin, sales_admin, operation_admin
export const getPerformance = async (req, res, next) => {
    try {
        const performance = await performanceService.getMemberPerformance();
        res.status(200).json(performance);
    } catch (error) {
        next(error);
    }
};
