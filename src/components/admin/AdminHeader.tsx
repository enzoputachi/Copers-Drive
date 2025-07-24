
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, Search, Bell, User, LogOut
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";



interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-2"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-gray-200 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button> */}
        <a 
          href={import.meta.env.VITE_WEB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline">
          View Site
        </a>
        {/* <Button variant="ghost" size="icon" aria-label="User menu">
          <User className="h-5 w-5" />
        </Button> */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
