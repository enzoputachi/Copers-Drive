import React from 'react';

const NeuraDetails = () => {
  return (
    <section className="flex flex-col lg:flex-row lg:justify-evenly lg:items-center text-white p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Image Section */}
      <div className="w-full lg:flex-1 lg:max-w-md mb-8 lg:mb-0">
        <div className="relative bg-gradient-to-br  rounded-lg p-4 sm:p-6 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="AI-powered investment analytics dashboard" 
            className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:flex-1 lg:max-w-xl lg:ml-12">        
        <p className="text-black mb-6 sm:mb-8  text-sm sm:text-base">
          We leverage AI to help you select, track and optimize investments across 
          various commodities, agriculture, and cryptocurrencies. Our technology 
          delivers daily insights, performance reports and market updates, 
          empowering you to make smarter financial decisions with ease.
        </p>
      </div>
    </section>
  );
};

export default NeuraDetails;