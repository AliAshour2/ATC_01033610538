export const UserRoleDistribution = ({
    adminCount,
    organizerCount,
    userCount,
    totalUsers,
  }: {
    adminCount: number;
    organizerCount: number;
    userCount: number;
    totalUsers: number;
  }) => {
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">Admins</div>
            <div className="text-sm text-muted-foreground">{adminCount}</div>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-2 rounded-full bg-red-500"
              style={{ width: `${(adminCount / totalUsers) * 100}%` }}
              aria-label={`${Math.round((adminCount / totalUsers) * 100)}% admins`}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">Organizers</div>
            <div className="text-sm text-muted-foreground">{organizerCount}</div>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(organizerCount / totalUsers) * 100}%` }}
              aria-label={`${Math.round((organizerCount / totalUsers) * 100)}% organizers`}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">Users</div>
            <div className="text-sm text-muted-foreground">{userCount}</div>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${(userCount / totalUsers) * 100}%` }}
              aria-label={`${Math.round((userCount / totalUsers) * 100)}% users`}
            />
          </div>
        </div>
      </div>
    );
  };