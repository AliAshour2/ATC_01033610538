
// import { motion } from "framer-motion";
// import { Outlet } from "react-router";
// import { AdminTopbar } from "./AdminTopbar";
// import { AdminSidebar } from "./AdminSidebar";
// const AdminLayout = () => {
//   return (
//     <div className="flex h-screen overflow-hidden">
//       <AdminSidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <AdminTopbar />
//         <motion.main
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900"
//         >
//           <div className="container mx-auto">
//             <Outlet />
//           </div>
//         </motion.main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import { motion } from "framer-motion";
import { Outlet } from "react-router";
import { AdminTopbar } from "./AdminTopbar";
import { AdminSidebar } from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-800 shadow-inner">
        <AdminTopbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto max-w-7xl text-gray-900 dark:text-gray-100">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
