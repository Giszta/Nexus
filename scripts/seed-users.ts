import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "@/repositories/user-repository";

const testUsers = [
  { email: "admin@nexus.dev", name: "Admin User", role: "ADMIN" },
  { email: "manager@nexus.dev", name: "Manager User", role: "MANAGER" },
  { email: "agent@nexus.dev", name: "Agent User", role: "AGENT" },
  { email: "viewer@nexus.dev", name: "Viewer User", role: "VIEWER" },
];

const PASSWORD = "Password123!";

async function seed() {
  for (const user of testUsers) {
    try {
      await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: PASSWORD,
          name: user.name,
        },
      });
      console.log(`✔ Utworzono: ${user.email}`);
    } catch (error) {
      console.log(`⚠ Pominięto ${user.email} (prawdopodobnie już istnieje)`);
    }
  }

  for (const user of testUsers) {
    await prisma.user.update({
      where: { email: user.email },
      data: { role: user.role },
    });
  }


console.log("\nGotowe. Konta w bazie (hasło dla wszystkich: Password123!):");
const allUsers = await UserRepository.listAll();
allUsers.forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email}`));
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });