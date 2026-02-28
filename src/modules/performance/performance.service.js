import prisma from "../../config/prisma.js";

// ✅ Get All Member Performance Detail
export const getMemberPerformance = async () => {
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
