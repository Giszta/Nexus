import { requireRole } from "@/lib/auth-helpers";

export default async function SettingsPage() {
  await requireRole(["ADMIN", "MANAGER"]);

  return <h1 className="text-2xl font-semibold">Settings</h1>;
}