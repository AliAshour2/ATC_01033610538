import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/types";
import { useGetAuthStateQuery, useLogoutMutation } from "@/features/auth/authApi";
import { Menu, X } from "lucide-react";


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Auth API hooks
  const { data: user } = useGetAuthStateQuery();
  const [logout] = useLogoutMutation();
  
  const isAuthenticated = !!user;
  
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
  ];

  const authenticatedItems = [
    { label: "My Bookings", path: "/bookings" },
  ];

  const adminItems = [
    { label: "Admin Dashboard", path: "/admin" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">EventHub</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-foreground/80 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated &&
                authenticatedItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              {isAuthenticated && user?.role === UserRole.ADMIN &&
                adminItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>

            <div className="flex items-center space-x-4">
            
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="cursor-pointer" onClick={() => navigate("/profile")}>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/register")}>Register</Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-effect"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {isAuthenticated &&
                  authenticatedItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block py-2 text-foreground/80 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                {isAuthenticated && user?.role === UserRole.ADMIN &&
                  adminItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block py-2 text-foreground/80 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="block py-2 text-foreground/80 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-0"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block py-2 text-foreground/80 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block py-2 text-foreground/80 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};