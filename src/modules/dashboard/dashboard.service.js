import prisma from "../../config/prisma.js";

// ✅ Executive Dashboard Stats (Internal Helper)
const getDashboardStatsInternal = async () => {
    const [
        totalQueries,
        totalBriefs,
        quotesSent,
        finalConverted,
        totalInteractionsAgg
    ] = await Promise.all([
        // Total Queries = total number of projects
        prisma.project.count(),

        // Total Briefs = projects with source BRIEF
        prisma.project.count({
            where: { source: "BRIEF" }
        }),

        // Quotes Sent = projects with queryStatus QUOTE_SENT
        prisma.project.count({
            where: { queryStatus: "QUOTE_SENT" }
        }),

        // Final Converted = projects with conversationStatus SOLD
        prisma.project.count({
            where: { conversationStatus: "SOLD" }
        }),

        // Total Interactions = sum of all followupCounts
        prisma.project.aggregate({
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

// Individual Members Performance (Removed public export)

// ✅ Member Specific Dashboard Stats
export const getMemberDashboardData = async (userId) => {
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
        pendingQuotes,
        followupsToday,
        weeklyActivityRaw
    ] = await Promise.all([
        // 1. Total Queries
        prisma.project.count({ where: { employeeId: userId } }),

        // 2. Converted (SOLD)
        prisma.project.count({
            where: { employeeId: userId, conversationStatus: "SOLD" }
        }),

        // 3. Quote Sent
        prisma.project.count({
            where: { employeeId: userId, queryStatus: "QUOTE_SENT" }
        }),

        // 4. Responded (Everything except NO_RESPONSE)
        prisma.project.count({
            where: {
                employeeId: userId,
                queryStatus: { not: "NO_RESPONSE" }
            }
        }),

        // 5. Recent Opportunities (Last 5)
        prisma.project.findMany({
            where: { employeeId: userId },
            orderBy: { createdAt: "desc" },
            take: 5
        }),

        // 6. Pending Quotes (e.g., CONVERSATION_RUNNING or BRIEF_REPLIED)
        prisma.project.count({
            where: {
                employeeId: userId,
                queryStatus: { in: ["CONVERSATION_RUNNING", "BRIEF_REPLIED", "CUSTOM_OFFER_SENT"] }
            }
        }),

        // 7. Follow-ups Today
        prisma.project.count({
            where: {
                employeeId: userId,
                conversationStatus: "NEED_TO_FOLLOW_UP"
            }
        }),

        // 8. Weekly Activity
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
            pendingQuotes,
            followupsToday,
            highValueLeads: 0 // Logic can be added later
        },
        weeklyActivity,
        recentOpportunities
    };
};

// ✅ Executive Dashboard Consolidated Stats
export const getExecutiveDashboardData = async () => {
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
        // 1. Core Summary Stats (Reusing partial logic but globally)
        getDashboardStatsInternal(),

        // 2. Market Activity Breakdown (By Query Status)
        prisma.project.groupBy({
            by: ["queryStatus"],
            _count: { id: true }
        }),

        // 3. Individual Profile Performance (By Profile Name)
        prisma.project.groupBy({
            by: ["profileName"],
            _count: { id: true }
        }),

        // 4. Monthly Trends (Last 6 Months)
        prisma.project.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, conversationStatus: true }
        })
    ]);

    // Format Status Breakdown
    const statusBreakdown = statusBreakdownRaw.map(item => ({
        status: item.queryStatus,
        count: item._count.id
    }));

    // Format Profile Performance
    // We need to fetch SOLD counts per profile to get conversion rates
    const soldStatsRaw = await prisma.project.groupBy({
        by: ["profileName"],
        where: { conversationStatus: "SOLD" },
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
    for (let i = 0; i < 6; i++) {
        const d = new Date(sixMonthsAgo);
        d.setMonth(d.getMonth() + i);
        const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
        trends[monthLabel] = { sales: 0, delivery: 0 };
    }

    monthlyTrendsRaw.forEach(item => {
        const monthLabel = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short" });
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
        profilePerformance
    };
};
