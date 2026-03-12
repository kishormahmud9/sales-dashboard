import prisma from "../../config/prisma.js";

/**
 * Helper to get date range for a given month and year.
 * If month/year not provided, defaults to current month.
 */
const getDateRange = (month, year) => {
    const now = new Date();
    const filterYear = year ? parseInt(year) : now.getFullYear();
    const filterMonth = month ? parseInt(month) - 1 : (year ? 0 : now.getMonth()); // If year but no month, default to Jan. If neither, current month.
    
    let startDate, endDate;

    if (month) {
        // Specific month filtering
        startDate = new Date(filterYear, filterMonth, 1);
        endDate = new Date(filterYear, filterMonth + 1, 0, 23, 59, 59, 999);
    } else if (year) {
        // Yearly filtering
        startDate = new Date(filterYear, 0, 1);
        endDate = new Date(filterYear, 11, 31, 23, 59, 59, 999);
    } else {
        // Default: Current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
};

// ✅ Executive Dashboard Stats (Internal Helper)
const getDashboardStatsInternal = async (dateFilter = {}) => {
    const [
        totalQueries,
        totalBriefs,
        quotesSent,
        finalConverted,
        totalInteractionsAgg
    ] = await Promise.all([
        // Total Queries = total number of projects
        prisma.project.count({ where: dateFilter }),

        // Total Briefs = projects with source BRIEF
        prisma.project.count({
            where: { ...dateFilter, source: "BRIEF" }
        }),

        // Quotes Sent = projects with queryStatus QUOTE_SENT
        prisma.project.count({
            where: { ...dateFilter, queryStatus: "QUOTE_SENT" }
        }),

        // Final Converted = projects with conversationStatus SOLD
        prisma.project.count({
            where: { ...dateFilter, conversationStatus: "SOLD" }
        }),

        // Total Interactions = sum of all followupCounts
        prisma.project.aggregate({
            where: dateFilter,
            _sum: { followupCount: true }
        })
    ]);

    const totalInteractions = totalInteractionsAgg._sum.followupCount ?? 0;
    const conversionRate = totalQueries > 0
        ? ((finalConverted / totalQueries) * 100).toFixed(2)
        : 0;

    return {
        totalQueries,
        totalBriefs,
        quotesSent,
        finalConverted,
        totalInteractions,
        conversionRate: `${conversionRate}%`
    };
};

// ✅ Member Specific Dashboard Stats
export const getMemberDashboardData = async (userId, month, year) => {
    const { startDate, endDate } = getDateRange(month, year);
    const dateFilter = { createdAt: { gte: startDate, lte: endDate } };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
        totalQueries,
        converted,
        quoteSent,
        respondedQueries,
        recentOpportunities,
        potentialClients,
        highValueLeads,
        followupsToday,
        weeklyActivityRaw
    ] = await Promise.all([
        // 1. Total Queries
        prisma.project.count({ where: { employeeId: userId, ...dateFilter } }),

        // 2. Converted (SOLD)
        prisma.project.count({
            where: { employeeId: userId, conversationStatus: "SOLD", ...dateFilter }
        }),

        // 3. Quote Sent
        prisma.project.count({
            where: { employeeId: userId, queryStatus: "QUOTE_SENT", ...dateFilter }
        }),

        // 4. Responded (Everything except NO_RESPONSE)
        prisma.project.count({
            where: {
                employeeId: userId,
                queryStatus: { not: "NO_RESPONSE" },
                ...dateFilter
            }
        }),

        // 5. Recent Opportunities (Last 5) - Still just last 5, but maybe we should filter by date too? 
        // User said "he can see current month data", so let's filter these by date too.
        prisma.project.findMany({
            where: { employeeId: userId, ...dateFilter },
            orderBy: { createdAt: "desc" },
            take: 5
        }),

        // 6. Potential Clients (Projects where a quote has been sent)
        prisma.project.count({
            where: {
                employeeId: userId,
                queryStatus: "QUOTE_SENT",
                ...dateFilter
            }
        }),

        // 7. High Value Leads (Custom Offer Sent)
        prisma.project.count({
            where: {
                employeeId: userId,
                queryStatus: { in: ["CUSTOM_OFFER_SENT", "BRIEF_CUSTOM_OFFER_SENT"] },
                ...dateFilter
            }
        }),

        // 8. Follow-ups Today (This might be better as "pending" for the filtered period, but user said "he can see current month data")
        // Usually "Today" stats are not filtered by month/year unless specifically asked. 
        // But for consistency with "landing on dashboard page by default he can see current month data", 
        // I'll keep Today's followups but maybe the user wants followups WITHIN that period.
        // Let's stick to the period for everything except "Today" specific things if they are indeed just for today.
        // Actually, "followupsToday" is filtered by "NEED_TO_FOLLOW_UP" status. 
        // I'll filter it by period as well to show relevant followups for that month.
        prisma.project.count({
            where: {
                employeeId: userId,
                conversationStatus: "NEED_TO_FOLLOW_UP",
                ...dateFilter
            }
        }),

        // 9. Weekly Activity (This is a 7-day rolling window in original code. 
        // If filtering by month/year, maybe we should show the whole month/year?)
        // The user didn't specify changing the graph, but it makes sense to show activity for the period.
        // However, the original code had a fixed 7-day window. 
        // If I change it to monthly/yearly, it might break the UI graph expectations.
        // I'll keep the 7-day window if NO filters are applied, but if filters are applied, 
        // maybe it should be the chosen period.
        // To keep it simple and safe for UI, I'll stick to the 7-day window as "recent activity" 
        // but maybe the user expects the whole dashboard to reflect the filter.
        // Let's keep it as is for now or adjust it. 
        // Actually, if they filter for "Last Year", a 7-day window is useless.
        // I'll just keep it 7 days for now to avoid UI breakage, or maybe just ignore date filter for the graph if it's "weekly".
        prisma.project.groupBy({
            by: ["createdAt"],
            where: {
                employeeId: userId,
                createdAt: { gte: sevenDaysAgo }
            },
            _count: { id: true }
        })
    ]);

    // Format Weekly Activity for the graph
    const weeklyActivity = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        const count = weeklyActivityRaw.filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate.toDateString() === d.toDateString();
        }).reduce((sum, item) => sum + item._count.id, 0);

        weeklyActivity.push({ day: dayLabel, count });
    }

    const responseRate = totalQueries > 0
        ? ((respondedQueries / totalQueries) * 100).toFixed(0)
        : 0;

    return {
        stats: {
            totalQueries,
            converted,
            quoteSent,
            responseRate: `${responseRate}%`
        },
        counters: {
            potentialClients,
            followupsToday,
            highValueLeads
        },
        weeklyActivity,
        recentOpportunities,
        filter: { startDate, endDate }
    };
};

// ✅ Executive Dashboard Consolidated Stats
export const getExecutiveDashboardData = async (month, year) => {
    const { startDate, endDate } = getDateRange(month, year);
    const dateFilter = { createdAt: { gte: startDate, lte: endDate } };

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
        basicStats,
        statusBreakdownRaw,
        profilePerformanceRaw,
        monthlyTrendsRaw
    ] = await Promise.all([
        // 1. Core Summary Stats
        getDashboardStatsInternal(dateFilter),

        // 2. Market Activity Breakdown (By Query Status)
        prisma.project.groupBy({
            by: ["queryStatus"],
            where: dateFilter,
            _count: { id: true }
        }),

        // 3. Individual Profile Performance (By Profile Name)
        prisma.project.groupBy({
            by: ["profileName"],
            where: dateFilter,
            _count: { id: true }
        }),

        // 4. Monthly Trends (Last 6 Months) - This is usually global to show context, 
        // but if filtering by year, it should probably show that year's months.
        prisma.project.findMany({
            where: month || year ? dateFilter : { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, conversationStatus: true }
        })
    ]);

    // Format Status Breakdown
    const statusBreakdown = statusBreakdownRaw.map(item => ({
        status: item.queryStatus,
        count: item._count.id
    }));

    // Format Profile Performance
    const soldStatsRaw = await prisma.project.groupBy({
        by: ["profileName"],
        where: { conversationStatus: "SOLD", ...dateFilter },
        _count: { id: true }
    });

    const profilePerformance = profilePerformanceRaw.map(item => {
        const total = item._count.id;
        const soldItem = soldStatsRaw.find(s => s.profileName === item.profileName);
        const sold = soldItem ? soldItem._count.id : 0;
        const rate = total > 0 ? ((sold / total) * 100).toFixed(1) : 0;
        return {
            profileName: item.profileName,
            totalQueries: total,
            converted: sold,
            conversionRate: `${rate}%`
        };
    });

    // Format Monthly Trends (Sales vs Delivery)
    const trends = {};
    const trendStartDate = month || year ? startDate : sixMonthsAgo;
    const trendMonthsCount = month || year ? (month ? 1 : 12) : 6;

    for (let i = 0; i < trendMonthsCount; i++) {
        const d = new Date(trendStartDate);
        d.setMonth(d.getMonth() + i);
        const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        trends[monthLabel] = { sales: 0, delivery: 0 };
    }

    monthlyTrendsRaw.forEach(item => {
        const monthLabel = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        if (trends[monthLabel]) {
            trends[monthLabel].delivery += 1;
            if (item.conversationStatus === "SOLD") {
                trends[monthLabel].sales += 1;
            }
        }
    });

    const monthlyTrends = Object.entries(trends).map(([month, data]) => ({
        month,
        ...data
    }));

    return {
        summary: basicStats,
        trends: monthlyTrends,
        marketActivity: statusBreakdown,
        profilePerformance,
        filter: { startDate, endDate }
    };
};
