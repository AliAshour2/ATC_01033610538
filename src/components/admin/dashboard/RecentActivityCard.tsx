import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, CalendarDays, BookCheck } from "lucide-react";

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest platform activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};