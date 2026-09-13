import { auth } from "@/lib/auth";
import Database from "better-sqlite3";

const testUsers = [
  { email: "admin@nexus.dev", name: "Admin User", role: "ADMIN" },
  { email: "manager@nexus.dev", name: "Manager User", role: "MANAGER" },
  { email: "agent@nexus.dev", name: "Agent User", role: "AGENT" },
  { email: "viewer@nexus.dev", name: "Viewer User", role: "VIEWER" },
];

const PASSWORD = "Password123!";

async function seed() {
      console.log("Skrypt wystartował");
  console.log("BETTER_AUTH_SECRET ustawiony:", !!process.env.BETTER_AUTH_SECRET);
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

  // signUpEmail zawsze tworzy użytkownika z domyślną rolą AGENT
  // (bo pole role ma input: false) — teraz nadpisujemy rolę
  // bezpośrednio w bazie, jako operacja administracyjna.
  const db = new Database("dev.db");
  for (const user of testUsers) {
    db.prepare("UPDATE user SET role = ? WHERE email = ?").run(
      user.role,
      user.email
    );
  }
  db.close();

  console.log("\nGotowe. Konta testowe (hasło dla wszystkich: Password123!):");
  testUsers.forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email}`));
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });