
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Map, Bus, Calendar, BookText, 
  CreditCard, Bell, FileText, Settings, Shield 
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Map, label: "Routes", href: "/admin/routes" },   
    { icon: Bus, label: "Buses", href: "/admin/buses" },
     { icon: Calendar, label: "Trips", href: "/admin/trips" },
    { icon: BookText, label: "Bookings", href: "/admin/bookings" },
    { icon: CreditCard, label: "Payments", href: "/admin/payments" },
    // { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    // { icon: FileText, label: "Logs", href: "/admin/logs" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: Shield, label: "Roles", href: "/admin/roles" },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 flex flex-col bg-white shadow-lg ",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link to="/admin" className="flex items-center">
          <span className="text-xl font-bold text-primary transition-opacity duration-300">
            {isOpen ? "Corpers Drive Admin" : "CD"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100",
                  !isOpen && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
