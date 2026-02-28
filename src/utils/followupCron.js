import cron from "node-cron";
import prisma from "../config/prisma.js";

/**
 * Cron Job to check follow-up delays.
 * Runs every hour.
 * Logic:
 * 1. If f01 is true and f02 is false for > 12 hours -> Notify "Send 2nd follow up"
 * 2. If f02 is true and f03 is false for > 12 hours -> Notify "Send 3rd follow up"
 */
export const initFollowupCron = () => {
    // Run every minute for testing
    cron.schedule("* * * * *", async () => {
        console.log("Running Follow-up Status Check Cron...");
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            // 1. Projects needing 2nd follow-up
            const projectsForF02 = await prisma.project.findMany({
                where: {
                    f01: true,
                    f02: false,
                    f01_at: { lt: fiveMinutesAgo },
                    NOT: {
                        notifications: {
                            some: {
                                message: { contains: "2nd follow up" }
                            }
                        }
                    }
                }
            });

            for (const project of projectsForF02) {
                await prisma.notification.create({
                    data: {
                        userId: project.employeeId,
                        projectId: project.id,
                        message: `For client "${project.clientName}", you did not send 2nd follow up.`,
                        type: "FOLLOW_UP_REMINDER"
                    }
                });
                console.log(`Notification created for project ${project.id} (F02)`);
            }

            // 2. Projects needing 3rd follow-up
            const projectsForF03 = await prisma.project.findMany({
                where: {
                    f02: true,
                    f03: false,
                    f02_at: { lt: fiveMinutesAgo },
                    NOT: {
                        notifications: {
                            some: {
                                message: { contains: "3rd follow up" }
                            }
                        }
                    }
                }
            });

            for (const project of projectsForF03) {
                await prisma.notification.create({
                    data: {
                        userId: project.employeeId,
                        projectId: project.id,
                        message: `For client "${project.clientName}", you did not send 3rd follow up.`,
                        type: "FOLLOW_UP_REMINDER"
                    }
                });
                console.log(`Notification created for project ${project.id} (F03)`);
            }

        } catch (error) {
            console.error("Error in Follow-up Cron:", error);
        }
    });
};
