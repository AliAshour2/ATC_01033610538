// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users } from "lucide-react";
// import { UserRoleDistribution } from "./UserRoleDistribution";




// type UserDistributionCardProps = {
//   adminCount: number;
//   organizerCount: number;
//   userCount: number;
//   totalUsers: number;
// };

// export const UserDistributionCard = ({
//   adminCount,
//   organizerCount,
//   userCount,
//   totalUsers,
// }: UserDistributionCardProps) => {
//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <Users className="mr-2 h-5 w-5" />
//           User Distribution
//         </CardTitle>
//         <CardDescription>Breakdown of users by role</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <UserRoleDistribution
//           adminCount={adminCount}
//           organizerCount={organizerCount}
//           userCount={userCount}
//           totalUsers={totalUsers}
//         />
//       </CardContent>
//     </Card>
//   );
// };

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
    <Card className="h-full transition-all duration-300 hover:shadow-md border-none bg-white/50 dark:bg-gray-900/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
          <Users className="mr-2 h-5 w-5 text-primary" />
          User Distribution
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Breakdown of users by role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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