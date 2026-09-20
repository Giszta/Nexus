"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/app/(app)/settings/actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type User = { id: string; name: string; email: string; role: string };

export function UserManagementTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(userId: string, newRole: string) {
    startTransition(() => {
      updateUserRole(userId, newRole as "ADMIN" | "MANAGER" | "AGENT" | "VIEWER");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Użytkownik</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rola</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              {user.id === currentUserId ? (
                <span className="text-sm text-muted-foreground">{user.role} (Ty)</span>
              ) : (
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}