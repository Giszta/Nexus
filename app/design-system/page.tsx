import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-10">
      <h1 className="text-2xl font-semibold">NEXUS Design System</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Input</h2>
        <Input placeholder="np. Numer zgłoszenia..." className="max-w-sm" />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Ticket #4821</CardTitle>
            <CardDescription>Customer reports door hinge problem</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Klient zgłasza problem z zawiasem drzwi prysznicowych od dwóch
              tygodni.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}