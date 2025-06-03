
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        {/* Admin Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content */}
        <div
          className={`flex flex-col flex-1 overflow-hidden transition-all duration-500 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;