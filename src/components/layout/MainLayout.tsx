
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const MainLayout = () => {
  return (    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
