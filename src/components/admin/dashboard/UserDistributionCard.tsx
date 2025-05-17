import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { UserRoleDistribution } from "./UserRoleDistribution";




type UserDistributionCardProps = {
  adminCount: number;
  organizerCount: number;
  userCount: number;
  totalUsers: number;
};

export const UserDistributionCard = ({
  adminCount,
  organizerCount,
  userCount,
  totalUsers,
}: UserDistributionCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          User Distribution
        </CardTitle>
        <CardDescription>Breakdown of users by role</CardDescription>
      </CardHeader>
      <CardContent>
        <UserRoleDistribution
          adminCount={adminCount}
          organizerCount={organizerCount}
          userCount={userCount}
          totalUsers={totalUsers}
        />
      </CardContent>
    </Card>
  );
};