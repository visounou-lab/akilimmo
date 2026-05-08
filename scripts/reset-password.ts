import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email    = "info@akilimmo.com";
  const password = "Test1234!";

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { email },
    data:  { password: hashed },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log("✓ Mot de passe mis à jour pour :", user.email);
  console.log("  ID   :", user.id);
  console.log("  Nom  :", user.name);
  console.log("  Rôle :", user.role);
}

main()
  .catch((e) => { console.error("Erreur :", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
