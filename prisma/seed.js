import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  const hashedPassword = await bcrypt.hash("11", 10);

  // Optional: clear existing users
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["admin@test.com", "member@test.com"],
      },
    },
  });

  // Create Sales Admin
  const admin = await prisma.user.create({
    data: {
      name: "Sales Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: Role.sales_admin,
      status: Status.active,
    },
  });

  // Create Sales Member
  const member = await prisma.user.create({
    data: {
      name: "Sales Member",
      email: "member@test.com",
      password: hashedPassword,
      role: Role.sales_member,
      status: Status.active,
    },
  });

  console.log("✅ Admin created:", admin.email);
  console.log("✅ Member created:", member.email);
  console.log("🌱 Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });