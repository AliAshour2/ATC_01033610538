import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
