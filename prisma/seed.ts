import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Admin2026!", 12);

  // Compte administrateur AKIL IMMO. Le mot de passe par défaut (Admin2026!)
  // DOIT être changé après la première connexion. La 2FA est ensuite exigée.
  const user = await prisma.user.upsert({
    where: { email: "davidayina.akilservices@gmail.com" },
    update: { role: "ADMIN" },
    create: {
      name: "David Ayina",
      email: "davidayina.akilservices@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Utilisateur seed : ${user.email} (${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
