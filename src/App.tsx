import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import ManageBooking from "./pages/ManageBooking";
import Contact from "./pages/ContactUs";
import About from './pages/About';
import EnvTest from './EnvTest.tsx';

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoutesPage from "./pages/admin/Routes";
import AdminTrips from "./pages/admin/Trips";
import AdminTripSeats from "./pages/admin/TripSeats";
import AdminBuses from "./pages/admin/Buses";
import AdminBookings from "./pages/admin/Bookings";
import AdminPayments from "./pages/admin/Payments";
import AdminNotifications from "./pages/admin/Notifications";
import AdminLogs from "./pages/admin/Logs";
import AdminSettings from "./pages/admin/Settings";
import AdminRoles from "./pages/admin/Roles";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Terms from "./pages/terms.tsx";
import { useSettings } from "./hooks/useApi.ts";
import MaintenancePage from "./pages/maintenancePage.tsx";

const queryClient = new QueryClient();

declare global {
  interface Window {
    gtag: (command: string, target: string, params?: any) => void;
  }
}


const PublicApp = () => {
  const { data, isLoading, error } = useSettings();
  const settings = data?.data?.data;

  // Show loading while fetching settings
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If there's an error fetching settings, continue with normal app
  // (you might want to handle this differently based on your needs)
  if (error) {
    console.warn("Failed to fetch settings, continuing without maintenance check:", error);
  }

  // Show maintenance page if maintenance mode is enabled
  if (settings?.maintenanceMode && !error) {
    return (
      <MaintenancePage 
        companyName={settings.companyName}
        contactEmail={settings.contactEmail || settings.supportEmail}
        contactPhone={settings.contactPhone || settings.supportPhone}
      />
    );
  }

  // Normal public app routes
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/manage-booking" element={<ManageBooking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/test-env" element={<EnvTest />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};


const App = () => {
  


  // Track analytics
  useEffect(() => {
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_path: window.location.pathname,
        });
      }
    };

    trackPageView();
    window.addEventListener('popstate', trackPageView);
    return () => window.removeEventListener('popstate', trackPageView);
  }, []);


  
  // Detect subdomain
  const host = window.location.hostname;
  const isAdminHost = host.startsWith("admin.");

  const renderAdmin = () => (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <Helmet>
            <title>Corpers Drive Admin</title>
          </Helmet>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin login route */}
                <Route path="/login" element={<AdminLogin />} />
                {/* Protected admin routes */}
                <Route path="/*" element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="routes" element={<AdminRoutesPage />} />
                  <Route path="trips" element={<AdminTrips />} />
                  <Route path="trips/:id/seats" element={<AdminTripSeats />} />
                  <Route path="buses" element={<AdminBuses />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="roles" element={<AdminRoles />} />
                  {/* Redirect unknown to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  const renderPublic = () => (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <Helmet>
            <title>Corpers Drive - Safe Travels for NYSC Corps Members</title>
            {/* meta tags omitted for brevity */}
          </Helmet>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PublicApp />
          </TooltipProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  return isAdminHost ? renderAdmin() : renderPublic();
};

export default App;
