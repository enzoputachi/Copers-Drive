
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import ManageBooking from "./pages/ManageBooking";
import Contact from "./pages/ContactUs";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoutes from "./pages/admin/Routes";
import AdminTrips from "./pages/admin/Trips";
import AdminBuses from "./pages/admin/Buses";
import AdminBookings from "./pages/admin/Bookings";
import AdminPayments from "./pages/admin/Payments";
import AdminNotifications from "./pages/admin/Notifications";
import AdminLogs from "./pages/admin/Logs";
import AdminSettings from "./pages/admin/Settings";
import AdminRoles from "./pages/admin/Roles";
import AdminTripSeats from "./pages/admin/TripSeats";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import About from './pages/About';

// Define window.gtag to avoid TypeScript errors
declare global {
  interface Window {
    gtag: (command: string, target: string, params?: any) => void;
  }
}

const queryClient = new QueryClient();

const App = () => {
  // Add page view tracking for analytics
  useEffect(() => {
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_path: window.location.pathname,
        });
      }
    };

    trackPageView();
    
    // Track page views on route changes
    window.addEventListener('popstate', trackPageView);
    
    return () => {
      window.removeEventListener('popstate', trackPageView);
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <Helmet>
            <title>Copers Drive - Safe Travels for NYSC Corps Members</title>
            <meta name="description" content="Copers Drive provides reliable transportation services for NYSC corps members traveling to and from orientation camps across Nigeria." />
            <meta property="og:title" content="Copers Drive - Safe Travels for NYSC Corps Members" />
            <meta property="og:description" content="Book safe, reliable, and comfortable transport to NYSC camps with Copers Drive - the preferred transport service for corps members." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="/logo.png" />
            <meta property="og:image" content="/logo.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Copers Drive - Safe Travels for NYSC Corps Members" />
            <meta name="twitter:description" content="Book safe, reliable, and comfortable transport to NYSC camps with Copers Drive." />
            <meta name="twitter:image" content="" />
            <link rel="canonical" href="/logo.png" />
            <meta name="theme-color" content="#6366F1" />
          </Helmet>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/about" element={<About />} />
                <Route path="/manage-booking" element={<ManageBooking />} />
                <Route path="/contact" element={<Contact />} />
                {/* Admin Login Route (Public) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="routes" element={<AdminRoutes />} />
                  <Route path="trips" element={<AdminTrips />} />
                  <Route path="trips/:id/seats" element={<AdminTripSeats />} />
                  <Route path="buses" element={<AdminBuses />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="roles" element={<AdminRoles />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
