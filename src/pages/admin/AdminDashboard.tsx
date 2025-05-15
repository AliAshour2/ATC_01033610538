import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, BookCheck, DollarSign, TrendingUp, Activity, ChevronRight } from "lucide-react";
import { useGetUsersQuery } from '@/features/user/userApi';
import { useGetEventsQuery } from '@/features/events/eventApi';
import { UserRole, type Event,  } from '@/types';
import { Link } from 'react-router-dom';
// Chart component stub - would be replaced with actual chart library
const DashboardChart = ({ data }: { data: number[] }) => {
  return (
    <div className="h-[200px] mt-2 flex items-end justify-between gap-2">
      {Array.from({ length: 12 }).map((_, i) => {
        const height = data[i] || Math.floor(Math.random() * 100) + 20;
        return (
          <div
            key={i}
            className="bg-primary/10 hover:bg-primary/20 rounded-t w-full"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
};

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
      // Get the 5 most recent events based on date
      const sortedEvents = [...events].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentEvents(sortedEvents.slice(0, 5));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalEvents: events.length,
        // Assuming we don't have booking data yet
        totalBookings: Math.floor(Math.random() * 100) + 50, // Placeholder
        totalRevenue: events.reduce((sum, event) => sum + event.price, 0) * 10, // Placeholder calculation
      }));
    }
  }, [events]);

  const usersByRole = {
    admin: users.filter(user => user.role === UserRole.ADMIN).length,
    organizer: users.filter(user => user.role === UserRole.ORGANIZER).length,
    user: users.filter(user => user.role === UserRole.USER).length,
  };

  // Placeholder for recent users (most recently created)
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PageHeader 
              title="Admin Dashboard" 
              description="Overview of your platform"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+12%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CalendarDays size={20} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+8%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <BookCheck size={20} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+24%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+18%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
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
                  <DashboardChart data={ []} />
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Recent Events
                  </CardTitle>
                  <CardDescription>Latest events on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEvents ? (
                    <div className="text-center py-4">Loading events...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentEvents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                              No events found
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentEvents.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">
                                <Link to={`/admin/events/${event.id}`} className="hover:underline">
                                  {event.title}
                                </Link>
                              </TableCell>
                              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                              <TableCell>${event.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                  <div className="mt-4">
                    <Link 
                      to="/admin/events" 
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      View all events
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Recent Users
                  </CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="text-center py-4">Loading users...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <Link to={`/admin/users`} className="hover:underline">
                                  {user.name}
                                </Link>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === UserRole.ADMIN ? "default" : 
                                                user.role === UserRole.ORGANIZER ? "outline" : "secondary"}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                  <div className="mt-4">
                    <Link 
                      to="/admin/users" 
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      View all users
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    User Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Admins</div>
                        <div className="text-sm text-muted-foreground">{usersByRole.admin}</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        <div 
                          className="h-2 rounded-full bg-red-500" 
                          style={{ width: `${(usersByRole.admin / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Organizers</div>
                        <div className="text-sm text-muted-foreground">{usersByRole.organizer}</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        <div 
                          className="h-2 rounded-full bg-blue-500" 
                          style={{ width: `${(usersByRole.organizer / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Users</div>
                        <div className="text-sm text-muted-foreground">{usersByRole.user}</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${(usersByRole.user / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Example activity feed - would be replaced with real data */}
                    <div className="flex items-start space-x-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">Sarah Johnson joined as Organizer</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <CalendarDays size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New event created</p>
                        <p className="text-xs text-muted-foreground">Tech Conference 2023 was added</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BookCheck size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New booking</p>
                        <p className="text-xs text-muted-foreground">5 tickets purchased for Music Festival</p>
                        <p className="text-xs text-muted-foreground">8 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;