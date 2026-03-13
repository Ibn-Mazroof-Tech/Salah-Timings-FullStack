import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultMosques = [
  {
    name: "Masjid Al Noor",
    location: "Jamia Nagar, New Delhi",
    image:
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1200&q=80",
    zuhrJamaat: "13:30",
    fajrOnFive: 25,
    fajrOffFive: 30,
    asrGap: 30,
    ishaGap: 45,
    maghribGap: 7
  },
  {
    name: "Markazi Masjid",
    location: "Okhla, New Delhi",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    zuhrJamaat: "13:30",
    fajrOnFive: 25,
    fajrOffFive: 30,
    asrGap: 30,
    ishaGap: 45,
    maghribGap: 7
  },
  {
    name: "Baitul Huda Masjid",
    location: "Batla House, New Delhi",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/77/Jama_Masjid%2C_Delhi.jpg",
    zuhrJamaat: "13:15",
    fajrOnFive: 25,
    fajrOffFive: 30,
    asrGap: 30,
    ishaGap: 45,
    maghribGap: 7
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN
      }
    });
  }

  const mosqueCount = await prisma.mosque.count();
  if (mosqueCount === 0) {
    await prisma.mosque.createMany({ data: defaultMosques });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
