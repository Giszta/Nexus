import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  );
}