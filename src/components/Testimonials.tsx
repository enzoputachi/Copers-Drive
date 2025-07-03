import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const testimonials = [
  {
    id: 1,
    name: "Omobomi Iyanu Bisola",
    role: "NYSC Corps Member - Lagos",
    quote: "Corpers Drive made my journey to the NYSC orientation camp stress-free and comfortable. The online booking was easy and the bus was clean and comfortable.",
    avatar: "",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    name: "Emmanuel Oluwakoya",
    role: "NYSC Corps Member - Abuja",
    quote: "Corpers Drive showed that you can get safety and comfort at an affordable price. I went to a lot of other companies and I was being offered less for more prizes. Corpers Drive is truly the best",
    avatar: "",
    bgColor: "bg-pink-50",
  },
  {
    id: 3,
    name: "Adelabu Jesutomisin Mathaihas",
    role: "NYSC Corps Member - Kaduna",
    quote: "Ever since I followed Corpers Drive, I have always been using and referring them to all that I know. They offered us free refreshments, Full AC, Charging Ports, Toilet in the bus and even music all through the journey. It was seamless I would say.",
    avatar: "",
    bgColor: "bg-purple-50"
  },
];

const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // Set up auto-scroll
    const interval = setInterval(() => {
      scrollNext();
    }, 4000); // Changed to 4 seconds for better readability

    // Update current index when carousel changes
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => clearInterval(interval);
  }, [api, scrollNext]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from NYSC corps members who have traveled with Corpers Drive
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel 
            setApi={setApi}
            opts={{
              loop: true,
              align: "center"
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0 mr-[2rem]">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-8">
                  <div className="flex items-start max-w-4xl">
                    {/* Speech bubble */}
                    <div className={`${testimonial.bgColor} p-6 rounded-2xl shadow-md ml-6 w-full`}>
                      {/* Content */}
                      <div className="flex space-x-4">
                        <div className="bg-white p-4 w-[4rem] h-[4rem] flex items-center justify-center rounded-full shadow-md transition-shadow">
                          <User className="h-8 w-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-600">{testimonial.role}</h3>
                          <div className="font-bold text-gray-800 uppercase">{testimonial.name}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-8 space-x-4">
              {/* <CarouselPrevious /> */}
              {/* <CarouselNext /> */}
            </div>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === current ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;