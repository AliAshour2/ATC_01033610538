import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, BookCheck, DollarSign } from "lucide-react";
import { useGetUsersQuery } from '@/features/user/userApi';
import { useGetEventsQuery } from '@/features/events/eventApi';
import { UserRole, type Event } from '@/types';
import { Link } from 'react-router-dom';

// Import our new components

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { DataTableCard } from '@/components/admin/dashboard/DataTableCard';
import { RecentActivityCard } from '@/components/admin/dashboard/RecentActivityCard';
import { DashboardChart } from '@/components/admin/dashboard/DashboardChart';
import { UserDistributionCard } from '@/components/admin/dashboard/UserDistributionCard';

const AdminDashboard = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();
  const { data: events = [], isLoading: isLoadingEvents } = useGetEventsQuery();
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (users.length > 0) {
      setStats(prev => ({ ...prev, totalUsers: users.length }));
    }
  }, [users]);

  useEffect(() => {
    if (events.length > 0) {
      const sortedEvents = [...events].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentEvents(sortedEvents.slice(0, 5));
      
      setStats(prev => ({
        ...prev,
        totalEvents: events.length,
        totalBookings: Math.floor(Math.random() * 100) + 50,
        totalRevenue: events.reduce((sum, event) => sum + event.price, 0) * 10,
      }));
    }
  }, [events]);

  const usersByRole = {
    admin: users.filter(user => user.role === UserRole.ADMIN).length,
    organizer: users.filter(user => user.role === UserRole.ORGANIZER).length,
    user: users.filter(user => user.role === UserRole.USER).length,
  };

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PageHeader 
              title="Admin Dashboard" 
              description="Comprehensive overview of platform performance and user activity"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users size={20} />}
                trendPercentage={12}
                trendDescription="from last month"
              />
              <StatsCard
                title="Total Events"
                value={stats.totalEvents}
                icon={<CalendarDays size={20} />}
                trendPercentage={8}
                trendDescription="from last month"
              />
              <StatsCard
                title="Bookings"
                value={stats.totalBookings}
                icon={<BookCheck size={20} />}
                trendPercentage={24}
                trendDescription="from last month"
              />
              <StatsCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                icon={<DollarSign size={20} />}
                trendPercentage={18}
                trendDescription="from last month"
              />
            </div>

            {/* Main dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trend over the past 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardChart data={[]} />
                </CardContent>
              </Card>

              {/* Recent Events */}
              <DataTableCard
                title="Recent Events"
                icon={<CalendarDays className="h-5 w-5" />}
                description="Latest events on the platform"
                viewAllLink="/admin/events"
                viewAllText="View all events"
                isLoading={isLoadingEvents}
                isEmpty={recentEvents.length === 0}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/admin/events/${event.id}`} 
                          className="hover:underline"
                          aria-label={`View details for ${event.title}`}
                        >
                          {event.title}
                        </Link>
                      </TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>${event.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTableCard>

              {/* Recent Users */}
              <DataTableCard
                title="Recent Users"
                icon={<Users className="h-5 w-5" />}
                description="Latest user registrations"
                viewAllLink="/admin/users"
                viewAllText="View all users"
                isLoading={isLoadingUsers}
                isEmpty={recentUsers.length === 0}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to="/admin/users" 
                          className="hover:underline"
                          aria-label={`View user ${user.name}`}
                        >
                          {user.name}
                        </Link>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === UserRole.ADMIN ? "default" : 
                                  user.role === UserRole.ORGANIZER ? "outline" : "secondary"}
                          aria-label={`User role: ${user.role}`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTableCard>

              {/* User Distribution */}
              <UserDistributionCard
                adminCount={usersByRole.admin}
                organizerCount={usersByRole.organizer}
                userCount={usersByRole.user}
                totalUsers={stats.totalUsers}
              />

              {/* Recent Activity */}
              <RecentActivityCard />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
