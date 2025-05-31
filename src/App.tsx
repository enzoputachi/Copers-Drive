
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
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
