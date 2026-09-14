import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5, "Tytuł musi mieć co najmniej 5 znaków").max(200),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  category: z
    .enum(["HARDWARE", "SOFTWARE", "BILLING", "ACCOUNT", "OTHER"])
    .optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;