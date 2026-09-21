"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const data = [
  { label: "Otwarte", count: 15 },
  { label: "W trakcie", count: 3 },
  { label: "Rozwiązane", count: 2 },
];

export function MiniStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data}>
        <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} />
        <Bar dataKey="count" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}