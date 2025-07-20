import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedRoutes from "@/components/FeaturedRoutes";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import AppPromo from "@/components/AppPromo";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/stores/bookingStore";
import NeuraDetails from "@/components/AboutCard1";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <BookingProvider>
        <main>
          <Hero />          
          <div className="">
            <FeaturedRoutes />
            <Features />
            {/* < NeuraDetails /> */}
            <Testimonials />
            {/* <AppPromo /> */}
           
            <Footer />
          </div>
        </main>
      </BookingProvider>
    </div>
  );
};

export default Index;