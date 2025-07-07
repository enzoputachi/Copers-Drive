import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedRoutes from "@/components/FeaturedRoutes";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import AppPromo from "@/components/AppPromo";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/stores/bookingStore";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <BookingProvider>
        <main>
          <Hero />
          {/* <FeaturedRoutes /> */}
          <div className="hidden md:block">
            <Features />
            <Testimonials />
            <AppPromo />
            <Footer />
          </div>
        </main>
      </BookingProvider>
    </div>
  );
};

export default Index;