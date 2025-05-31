import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BookCheck, CalendarDays, Users } from "lucide-react";

type ActivityItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
};

const activityItems: ActivityItem[] = [
  {
    id: "1",
    icon: <Users size={16} />,
    title: "New user registered",
    description: "Sarah Johnson joined as Organizer",
    time: "2 hours ago",
  },
  {
    id: "2",
    icon: <CalendarDays size={16} />,
    title: "New event created",
    description: "Tech Conference 2023 was added",
    time: "5 hours ago",
  },
  {
    id: "3",
    icon: <BookCheck size={16} />,
    title: "New booking",
    description: "5 tickets purchased for Music Festival",
    time: "8 hours ago",
  },
];

export const RecentActivityCard = () => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Latest platform activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activityItems.map((item,) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform duration-200">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};