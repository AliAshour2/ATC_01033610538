import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trendPercentage: number;
  trendDescription: string;
};

export const StatsCard = ({
  title,
  value,
  icon,
  trendPercentage,
  trendDescription,
}: StatsCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          {icon}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-3 flex items-center">
        <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
        <span className="text-emerald-500 font-semibold">+{trendPercentage}%</span>
        <span className="ml-1.5 opacity-90">{trendDescription}</span>
      </div>
    </CardContent>
  </Card>
  );
};