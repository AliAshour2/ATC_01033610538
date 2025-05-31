import { useState, useEffect } from "react";

export const DashboardChart = ({ data }: { data: number[] }) => {
  const [animatedData, setAnimatedData] = useState<number[]>([]);

  // Animate chart on mount/load
  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const newData = [...data];
    const animateStep = (step: number) => {
      if (step >= 10) {
        setAnimatedData(data);
        return;
      }

      const steppedData = newData.map((value) =>
        Math.min(value, Math.floor(Math.random() * value * (step / 10) + 20))
      );
      setAnimatedData(steppedData);

      timeoutIds.push(setTimeout(() => animateStep(step + 1), 50));
    };

    animateStep(0);

    return () => timeoutIds.forEach(clearTimeout);
  }, [data]);

  return (
    <div className="h-[200px] mt-2 flex items-end justify-between gap-1 relative">
      {Array.from({ length: 12 }).map((_, i) => {
        const height = animatedData[i] || 20;

        return (
          <div
            key={i}
            className="group relative flex-1 bg-gradient-to-t from-primary/30 to-primary/70 hover:from-primary/40 hover:to-primary rounded-t transition-all duration-300 shadow-sm"
            style={{ height: `${height}%` }}
            aria-label={`Month ${i + 1} revenue: $${height}`}
          >
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
              ${height}k
            </div>
          </div>
        );
      })}
      
      {/* Optional baseline indicator */}
      <div className="absolute bottom-0 w-full h-px bg-muted-foreground/20"></div>
    </div>
  );
};