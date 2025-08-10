import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickAction {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  layout?: "grid" | "vertical";
}

export default function QuickActions({
  actions,
  layout = "vertical",
}: QuickActionsProps) {
  if (layout === "grid") {
    return (
      <div className={`grid gap-6 md:grid-cols-${Math.min(actions.length, 3)}`}>
        {actions.map((action, index) => (
          <Button
            key={index}
            asChild
            variant="outline"
            className="h-auto p-6 flex-col gap-3"
          >
            <Link href={action.href}>
              <action.icon className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="outline"
              className="justify-start h-auto p-4"
            >
              <Link href={action.href}>
                <action.icon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
