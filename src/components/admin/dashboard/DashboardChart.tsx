export const DashboardChart = ({ data }: { data: number[] }) => {
    return (
      <div className="h-[200px] mt-2 flex items-end justify-between gap-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const height = data[i] || Math.floor(Math.random() * 100) + 20;
          return (
            <div
              key={i}
              className="bg-primary/10 hover:bg-primary/20 rounded-t w-full transition-all duration-300"
              style={{ height: `${height}%` }}
              aria-label={`Month ${i + 1} revenue: $${height}`}
            />
          );
        })}
      </div>
    );
  };