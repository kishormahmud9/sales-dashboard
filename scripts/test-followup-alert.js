import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTestProjectsForAllUsers() {
    try {
        // 1. Get ALL users
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            console.error("No users found in database. Please register a user first.");
            return;
        }

        console.log(`Found ${users.length} users. Creating stale projects for everyone...`);

        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

        for (const user of users) {
            const project = await prisma.project.create({
                data: {
                    employeeId: user.id,
                    soldById: user.id,
                    profileName: "BYTE_CRAFT",
                    clientName: `Test for ${user.name}`,
                    source: "QUERY",
                    serviceLine: "CUSTOM_WEBSITE",
                    country: "Localhost",
                    quote: "http://example.com/test",
                    queryStatus: "CONVERSATION_RUNNING",
                    conversationStatus: "NEED_TO_FOLLOW_UP",
                    f01: true,
                    f01_at: threeMinutesAgo,
                }
            });
            console.log(`✅ Project created for user: ${user.name} (${user.id})`);
        }

        console.log("\nNext step: Start your server and wait for the cron logs in your terminal.");

    } catch (error) {
        console.error("Error creating test data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestProjectsForAllUsers();
