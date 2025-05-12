import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  ChevronRight,
  ChevronLeft,
  BarChart2,
  Calendar,
  Users,
  Ticket,
  Settings,
  Home,
  LogOut
} from "lucide-react";
import { useLogoutMutation } from "@/features/auth/authApi";

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logout , isLoading] = useLogoutMutation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <BarChart2 size={18} /> },
    { name: "Events", path: "/admin/events", icon: <Calendar size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <Ticket size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];
  
  return (
    <motion.aside
      layout
      className="bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto"
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        {!isCollapsed && (
          <NavLink to="/admin" className="text-2xl font-bold bg-gradient-to-r from-primary to-eventAmber bg-clip-text text-transparent">
            Admin
          </NavLink>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-md transition-all
                  ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'}
                `}
                end={item.path === "/admin"}
              >
                <span className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <NavLink to="/" className={`
          flex items-center px-3 py-2.5 mb-2 rounded-md transition-all
          hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300
        `}>
          <span className="flex items-center justify-center w-6 h-6">
            <Home size={18} />
          </span>
          {!isCollapsed && <span className="ml-3">Back to Site</span>}
        </NavLink>
        <Button 
          variant="ghost" 
          className={`w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300`}
          onClick={handleLogout}
        >
          <span className="flex items-center justify-center w-6 h-6">
            <LogOut size={18} />
          </span>
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
};