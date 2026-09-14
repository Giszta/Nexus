"use client";

import { useTransition } from "react";
import { assignTicket } from "@/app/(app)/tickets/actions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function TicketAssignSelect({
  ticketId,
  currentAssigneeId,
  assignableUsers,
}: {
  ticketId: string;
  currentAssigneeId: string | null;
  assignableUsers: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(() => {
      assignTicket(ticketId, value);
    });
  }

  return (
    <Select
      defaultValue={currentAssigneeId ?? undefined}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Nieprzypisany" />
      </SelectTrigger>
      <SelectContent>
        {assignableUsers.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}