import { getServerSession } from "@/lib/session";
import { UserRepository } from "@/repositories/user-repository";
import { ProfileForm } from "@/components/settings/profile-form";
import { UserManagementTable } from "@/components/settings/user-management-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await getServerSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  const allUsers = isAdmin ? await UserRepository.listAll() : [];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            currentName={session!.user.name}
            email={session!.user.email}
            role={role ?? "—"}
          />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Zarządzanie użytkownikami</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagementTable users={allUsers} currentUserId={session!.user.id} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">O aplikacji</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>NEXUS — AI Operations & Knowledge Platform</p>
          <p>Portfolio project demonstrujący pełen cykl budowy aplikacji SaaS z AI.</p>
          <a
            href="https://github.com/Giszta/Nexus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Zobacz kod źródłowy na GitHub
          </a>
        </CardContent>
      </Card>
    </div>
  );
}