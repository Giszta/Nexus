"use client";

import { useTransition } from "react";
import { updateTicketStatus } from "@/app/(app)/tickets/actions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { TicketStatus } from "@prisma/client";

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Otwarty",
  IN_PROGRESS: "W trakcie",
  RESOLVED: "Rozwiązany",
  CLOSED: "Zamknięty",
};

export function TicketStatusSelect({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(() => {
      updateTicketStatus(ticketId, value as TicketStatus);
    });
  }

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}