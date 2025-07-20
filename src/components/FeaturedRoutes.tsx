import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Route = {
  id: number;
  from: string;
  to: string;
  price: number;
  duration: string;
  image: string;
  promo?: {
    type: "early-bird" | "student" | "nysc";
    discount: number;
  };
};

const featuredRoutes: Route[] = [
  {
    id: 1,
    from: "Lagos",
    to: "Abuja",
    price: 15000,
    duration: "8 hours",
    image: "/anambra.jpg",
    promo: {
      type: "nysc",
      discount: 20,
    },
  },
  {
    id: 2,
    from: "Lagos",
    to: "Benin City",
    price: 8500,
    duration: "5 hours",
    image: "/akwaibom.png",
  },
  {
    id: 3,
    from: "Abuja",
    to: "Kano",
    price: 9000,
    duration: "6 hours",
    image: "/anambra.jpg",
    promo: {
      type: "early-bird",
      discount: 15,
    },
  },
  {
    id: 4,
    from: "Port Harcourt",
    to: "Owerri",
    price: 6000,
    duration: "3 hours",
    image: "/akwaibom.png",
  },
  {
    id: 5,
    from: "Enugu",
    to: "Lagos",
    price: 12500,
    duration: "7 hours",
    image: "/anambra.jpg",
    promo: {
      type: "student",
      discount: 10,
    },
  },
];

const PromoLabel = ({ type, discount }: { type: string; discount: number }) => {
  let bgColor = "";
  let label = "";
  
  switch (type) {
    case "early-bird":
      bgColor = "bg-yellow-500";
      label = "Early Bird";
      break;
    case "student":
      bgColor = "bg-yellow-500";
      label = "Student";
      break;
    case "nysc":
      bgColor = "bg-yellow-500";
      label = "NYSC Special";
      break;
    default:
      bgColor = "bg-gray-600";
      label = "Promo";
  }
  
  return (
    <div className={`absolute top-4 right-4 ${bgColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
      {label} {discount}% OFF
    </div>
  );
};

const FeaturedRoutes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate how many slides are visible at once
  const getVisibleSlides = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg screens
      if (window.innerWidth >= 768) return 2;  // md screens
      return 1; // sm screens
    }
    return 3; // default
  };
  
  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides());
  
  // Update visible slides on window resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate the maximum index (don't scroll beyond the last set of visible slides)
  const maxIndex = Math.max(0, featuredRoutes.length - visibleSlides);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      // If we've reached the end, restart from the beginning
      return next > maxIndex ? 0 : next;
    });
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      // If we're at the beginning, go to the end
      return next < 0 ? maxIndex : next;
    });
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, currentIndex, maxIndex]);

  const onSubmit = (route: Route) => {
    console.log("Booking route:", route);
    alert(`Booking ${route.from} to ${route.to} for ₦${route.price.toLocaleString()}`);
  };
  
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-16">Routes with Split Payment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-8">
            Secure your seat with just ₦5,000! Pay the remaining balance when you arrive at the terminal
          </p>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
            >
              {featuredRoutes.map((route) => (
                <div 
                  key={route.id} 
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
                > 
                  <div 
                    className="relative h-80 bg-cover bg-center border border-gray-200 rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg"
                    style={{ backgroundImage: `url(${route.image})` }}
                  >
                    {route.promo && (
                      <PromoLabel type={route.promo.type} discount={route.promo.discount} />
                    )}
                    
                    {/* Transparent overlay for the bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-white">{route.from} → {route.to}</div>
                        <div className="text-gray-200 text-sm">{route.duration}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <span className="text-sm text-gray-300">Pay ₦5,000 now</span>
                          <div className="text-xl font-bold">₦{(route.price - 5000).toLocaleString()} at terminal</div>
                        </div>
                        <button
                          className="px-6 py-2 bg-white text-black hover:bg-gray-100 rounded-md font-medium transition-colors"
                          onClick={() => onSubmit(route)}
                        >
                          Pay ₦5,000
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="hidden md:block">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors z-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors z-10"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoutes;