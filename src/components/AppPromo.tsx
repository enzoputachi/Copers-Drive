
import React from "react";
import { Button } from "@/components/ui/button";

const AppPromo = () => {
  return (
    <section className="py-16 bg-primary text-white hidden md:flex"
    style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      height: '500px'
      // backgroundPosition: 'center'
    }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-black p-4 rounded-xl">Download the Corpers Drive App</h2>
            <p className="text-lg mb-6 opacity-90">
              Book tickets, manage your journeys, and get real-time updates on your mobile device.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-black hover:bg-gray-900 text-white" size="lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Google Play
              </Button>
              <Button className="bg-black hover:bg-gray-900 text-white" size="lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                App Store
              </Button>
            </div>
            
            <div className="mt-6 flex items-center">
              <div className="bg-white text-primary font-bold rounded-full px-4 py-1 text-xs">
                50K+ Downloads
              </div>
              <div className="ml-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="ml-2 text-sm opacity-90">4.8/5</div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 h-auto">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl transform rotate-6"></div>
              <img 
                src="/ad.png" 
                alt="Corpers Drive Mobile App" 
                className="relative z-10 rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black font-bold rounded-full p-3 z-20 transform rotate-12">
                Easy Booking!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
