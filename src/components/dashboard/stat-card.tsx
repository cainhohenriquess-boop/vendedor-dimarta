import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone?: "primary" | "accent" | "success" | "warning";
};

const tones = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-rose-100 text-rose-700",
} as const;

export function StatCard({
  title,
  value,
  description,
  icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div>
            <p className="font-display text-4xl font-semibold text-slate-900">
              {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            tones[tone],
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
