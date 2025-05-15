import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import {
  useLogoutMutation,
  useGetAuthStateQuery,
} from "@/features/auth/authApi";
import { Settings, LogOut, ArrowLeft, User } from "lucide-react";

export const AdminTopbar = () => {
  const [logout] = useLogoutMutation();
  const { data: user } = useGetAuthStateQuery();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Admin Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-9 w-9 hover:ring-2 hover:ring-primary/50 dark:hover:ring-primary/80 transition-all">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-white dark:bg-primary/90">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md"
            >
              <DropdownMenuLabel className="text-gray-700 dark:text-gray-300 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>My Account</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem 
                onClick={() => navigate("/")}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Back to site
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate("/admin/settings")}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuGroup>
        </DropdownMenu>
      </div>
    </div>
  );
};