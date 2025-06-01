
import React from "react";
import { AirVent, Shield, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const features = [
    {
      icon: <AirVent className="h-10 w-10" />,
      title: "Air-conditioned Comfort",
      description: "All our buses are equipped with modern air-conditioning systems to ensure a comfortable journey regardless of the weather."
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Safety & Reliability",
      description: "Your safety is our priority. We maintain all vehicles regularly and employ experienced drivers with excellent safety records."
    },
    {
      icon: <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>,
      title: "Eco-friendly E-tickets",
      description: "Go paperless with our electronic ticketing system. Book, pay, and receive your ticket entirely online - helping the environment."
    },
    {
      icon: <Bell className="h-10 w-10" />,
      title: "24/7 Online Support",
      description: "Our customer support team is available around the clock to assist with inquiries, bookings, and any travel emergencies."
    },
  ];

  return (
    <section className="py-16 bg-green-800">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">Why Choose Copers Drive</h2>
          <p className="text-white max-w-2xl mx-auto">
            We provide more than just transportation - we offer peace of mind for NYSC corps members traveling to their service locations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="mb-4 text-yellow-500">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Badge variant="outline" className="text-sm text-white py-2 px-4 bg-primary/10 border-primary/20">
            NYSC Corps Members Get Special Discounts!
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default Features;
