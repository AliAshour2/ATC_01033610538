import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trendPercentage: number;
  trendDescription: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'indigo';
};

const colorStyles = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
};

export const StatsCard = ({
  title,
  value,
  icon,
  trendPercentage,
  trendDescription,
  color = 'blue',
}: StatsCardProps) => {
  const selectedStyle = colorStyles[color];

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl border-none bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm hover:-translate-y-0.5">
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 w-full h-full border ${selectedStyle} rounded-lg opacity-30 pointer-events-none`}></div>
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold tracking-tight">
            {value}
          </div>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 ${selectedStyle}`}
          >
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <TrendingUp className={`h-3.5 w-3.5 mr-1.5 ${selectedStyle.replace('/10', '-500')}`} />
          <span className={`${selectedStyle.replace('/10', '-500')} font-semibold`}>
            +{trendPercentage}%
          </span>
          <span className="ml-1.5 text-muted-foreground">{trendDescription}</span>
        </div>
      </CardContent>
    </Card>
  );
};