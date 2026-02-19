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
