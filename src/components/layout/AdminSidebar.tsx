import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  LogOut,
} from "lucide-react";
import { useLogoutMutation } from "@/features/auth/authApi";
import { handleError } from "@/helpers/handleError";
import toast from "react-hot-toast";

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logout , isLoading] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      toast.error("Try logout again");
      handleError(error);
    }
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
      className="bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col sticky top-0"
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <NavLink
                to="/admin"
                className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent"
              >
                Admin
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2">
        <nav className="px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-700 dark:bg-primary/20 text-white dark:text-primary-foreground font-medium border bottom-0.5 border-blue-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  end={item.path === "/admin"}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex items-center justify-center w-6 h-6 ${
                          isActive
                            ? "text-primary dark:text-primary-foreground"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <motion.span
                          className="ml-3"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <NavLink
          to="/"
          className={({ isActive }) => `
            flex items-center px-3 py-3 mb-2 rounded-lg transition-all
            ${
              isActive
                ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-medium "
                : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
            }
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <span className="flex items-center justify-center w-6 h-6 text-gray-500 dark:text-gray-400">
            <Home size={18} />
          </span>
          {!isCollapsed && (
            <motion.span
              className="ml-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              Back to Site
            </motion.span>
          )}
        </NavLink>
        <Button
          variant="ghost"
          className={`w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 ${
            isCollapsed ? "justify-center" : ""
          }`}
          onClick={handleLogout}
        >
          <span className="flex items-center justify-center w-6 h-6 text-gray-500 dark:text-gray-400">
            <LogOut size={18} />
          </span>
          {!isCollapsed && (
            <motion.span
              className="ml-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}

            >
               {isLoading?  "Loggint out":"Logout"}
            </motion.span>
          )}
        </Button>
      </div>
    </motion.aside>
  );
};
