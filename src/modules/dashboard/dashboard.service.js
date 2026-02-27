import prisma from "../../config/prisma.js";

// ✅ Executive Dashboard Stats
export const getDashboardStats = async () => {
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

// ✅ Individual Members Performance
export const getUserPerformance = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ["sales_member", "sales_tl", "operation_member", "operation_tl"]
            }
        },
        select: {
            id: true,
            name: true,
            role: true,
            total_queries: true,
            converted_queries: true,
            quote_sent: true,
            conversion_rate: true
        },
        orderBy: { total_queries: "desc" }
    });

    return users;
};

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
