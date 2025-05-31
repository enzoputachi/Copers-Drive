
import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
    image: "/route.jpg",
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
    image: "/route.jpg",
  },
  {
    id: 3,
    from: "Abuja",
    to: "Kano",
    price: 9000,
    duration: "6 hours",
    image: "/route.jpg",
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
    image: "/route.jpg",
  },
  {
    id: 5,
    from: "Enugu",
    to: "Lagos",
    price: 12500,
    duration: "7 hours",
    image: "/route.jpg",
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
  const isMobile = useIsMobile();
  
  return (
    <section className="py-[5rem] bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-[4rem]">Popular Routes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-[2rem]">
            Discover our most popular routes with competitive fares and special promotions for NYSC corps members
          </p>
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredRoutes.map((route) => (
                <CarouselItem 
                  key={route.id} 
                  className={isMobile ? "pl-4 basis-full" : "pl-4 basis-1/2 lg:basis-1/3"}
                >
                  <div className="relative h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                    <div 
                      className="h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${route.image})` }}
                    />
                    
                    {route.promo && (
                      <PromoLabel type={route.promo.type} discount={route.promo.discount} />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold">{route.from} → {route.to}</div>
                        <div className="text-gray-500 text-sm">{route.duration}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-500 text-sm">From</div>
                          <div className="text-2xl font-bold text-primary">
                            ₦{route.price.toLocaleString()}
                          </div>
                        </div>
                        <Button className="px-6">Book</Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoutes;
