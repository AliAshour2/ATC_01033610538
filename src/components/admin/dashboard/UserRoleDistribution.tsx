// export const UserRoleDistribution = ({
//     adminCount,
//     organizerCount,
//     userCount,
//     totalUsers,
//   }: {
//     adminCount: number;
//     organizerCount: number;
//     userCount: number;
//     totalUsers: number;
//   }) => {
//     return (
//       <div className="space-y-4">
//         <div>
//           <div className="flex items-center justify-between mb-1">
//             <div className="text-sm font-medium">Admins</div>
//             <div className="text-sm text-muted-foreground">{adminCount}</div>
//           </div>
//           <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
//             <div
//               className="h-2 rounded-full bg-red-500"
//               style={{ width: `${(adminCount / totalUsers) * 100}%` }}
//               aria-label={`${Math.round((adminCount / totalUsers) * 100)}% admins`}
//             />
//           </div>
//         </div>
//         <div>
//           <div className="flex items-center justify-between mb-1">
//             <div className="text-sm font-medium">Organizers</div>
//             <div className="text-sm text-muted-foreground">{organizerCount}</div>
//           </div>
//           <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
//             <div
//               className="h-2 rounded-full bg-blue-500"
//               style={{ width: `${(organizerCount / totalUsers) * 100}%` }}
//               aria-label={`${Math.round((organizerCount / totalUsers) * 100)}% organizers`}
//             />
//           </div>
//         </div>
//         <div>
//           <div className="flex items-center justify-between mb-1">
//             <div className="text-sm font-medium">Users</div>
//             <div className="text-sm text-muted-foreground">{userCount}</div>
//           </div>
//           <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
//             <div
//               className="h-2 rounded-full bg-green-500"
//               style={{ width: `${(userCount / totalUsers) * 100}%` }}
//               aria-label={`${Math.round((userCount / totalUsers) * 100)}% users`}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };




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
  const getPercentage = (count: number) =>
    totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Role Distribution</h3>

      {/* Admin */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admins</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {adminCount} ({getPercentage(adminCount)}%)
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(adminCount / totalUsers) * 100}%` }}
            aria-label={`${getPercentage(adminCount)}% admins`}
          />
        </div>
      </div>

      {/* Organizer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Organizers</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {organizerCount} ({getPercentage(organizerCount)}%)
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(organizerCount / totalUsers) * 100}%` }}
            aria-label={`${getPercentage(organizerCount)}% organizers`}
          />
        </div>
      </div>

      {/* User */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Users</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userCount} ({getPercentage(userCount)}%)
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(userCount / totalUsers) * 100}%` }}
            aria-label={`${getPercentage(userCount)}% users`}
          />
        </div>
      </div>

      {/* Optional Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span>Total Users: {totalUsers}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Admin
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Organizer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> User
          </span>
        </div>
      </div>
    </div>
  );
};