import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRole } from "@/types"
import { useGetAuthStateQuery, useLogoutMutation } from "@/features/auth/authApi"
import { Menu, X, CalendarDays, User, LogOut, Home, LayoutDashboard } from "lucide-react"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Auth API hooks
  const { data: user } = useGetAuthStateQuery()
  const [logout] = useLogoutMutation()

  const isAuthenticated = !!user

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { label: "Home", path: "/", icon: <Home size={16} /> },
    { label: "Events", path: "/events", icon: <CalendarDays size={16} /> },
  ]

  const authenticatedItems = [{ label: "My Bookings", path: "/bookings", icon: <CalendarDays size={16} /> }]

  const adminItems = [{ label: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard size={16} /> }]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <h1
                className="text-xl font-bold"
                style={{
                  background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                EventTech
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated &&
                authenticatedItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              {isAuthenticated &&
                user?.role === UserRole.ADMIN &&
                adminItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="relative group">
                    <Avatar
                      className="cursor-pointer border-2 border-transparent hover:border-indigo-300 transition-all"
                      onClick={() => navigate("/profile")}
                      style={{ borderRadius: "50%" }}
                    >
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback
                        className="text-white"
                        style={{ background: "linear-gradient(to bottom right, #8b5cf6, #ec4899)" }}
                      >
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-0.5 rounded-full">
                        <User size={12} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-1.5"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    size="sm"
                    style={{
                      background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                      color: "white",
                    }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            {isAuthenticated && (
              <Avatar
                className="cursor-pointer border-2 border-transparent hover:border-indigo-300 transition-all h-8 w-8"
                onClick={() => navigate("/profile")}
              >
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback
                  className="text-white text-xs"
                  style={{ background: "linear-gradient(to bottom right, #8b5cf6, #ec4899)" }}
                >
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
                {isAuthenticated &&
                  authenticatedItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                {isAuthenticated &&
                  user?.role === UserRole.ADMIN &&
                  adminItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
                      onClick={() => {
                        navigate("/login")
                        setIsOpen(false)
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full hover:opacity-90 transition-opacity text-white"
                      style={{ background: "linear-gradient(to right, #8b5cf6, #ec4899)" }}
                      onClick={() => {
                        navigate("/register")
                        setIsOpen(false)
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
