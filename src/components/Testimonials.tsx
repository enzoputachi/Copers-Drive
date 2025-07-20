import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const testimonials = [
  {
    id: 1,
    name: "Omobomi Iyanu Bisola",
    role: "NYSC Corps Member - Lagos",
    quote:
      "Corpers Drive made my journey to the NYSC orientation camp stress-free and comfortable. The online booking was easy and the bus was clean and comfortable.",
    avatar: "",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    name: "Emmanuel Oluwakoya",
    role: "NYSC Corps Member - Abuja",
    quote:
      "Corpers Drive showed that you can get safety and comfort at an affordable price. I went to a lot of other companies and I was being offered less for more prizes. Corpers Drive is truly the best.",
    avatar: "",
    bgColor: "bg-pink-50",
  },
  {
    id: 3,
    name: "Adelabu Jesutomisin Mathaihas",
    role: "NYSC Corps Member - Kaduna",
    quote:
      "Ever since I followed Corpers Drive, I have always been using and referring them to all that I know. They offered us free refreshments, full AC, charging ports, toilet in the bus and even music all through the journey. It was seamless, I would say.",
    avatar: "",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    name: "Emmanuel",
    role: "NYSC Corps Member - Anambra",
    quote:
      "Corpers Drive solved a problem for thousands of Corps members, still providing comfort and affordability. I didn't even hesitate to refer my friends—thought it was too good to be true until they actually promised and delivered.",
    avatar: "",
    bgColor: "bg-blue-50",
  },
  {
    id: 5,
    name: "Ikulayo Olajumoke",
    role: "NYSC Corps Member - Cross River",
    quote:
      "Honestly, I’m going to be recommending you guys to all my friends. My journey was so smooth and your drivers are so professional. The refreshments provided made it even better. Thank you, Corpers Drive.",
    avatar: "",
    bgColor: "bg-yellow-50",
  },
  {
    id: 6,
    name: "Elizabeth",
    role: "NYSC Corps Member - Abia",
    quote:
      "Corpers Drive gave me the best transport service when I felt all hope was lost. They surprised me beyond expectations. Their referral payout is also really encouraging. You guys are truly revolutionary!",
    avatar: "",
    bgColor: "bg-red-50",
  },
  {
    id: 7,
    name: "Aminat",
    role: "NYSC Corps Member - Akwa Ibom",
    quote:
      "I will keep referring people to your services. It's one of the best and most trusted means of transportation, especially for Corps members and delivery of goods. I tested it as a Batch B2 member and I loved the service. Keep it up, guys!",
    avatar: "",
    bgColor: "bg-indigo-50",
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
    }, 4000);

    // Update current index when carousel changes
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => clearInterval(interval);
  }, [api, scrollNext]);

  return (
    <section className="py-8 md:py-16 bg-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Hear from NYSC corps members who have traveled with Corpers Drive
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel 
            setApi={setApi}
            opts={{
              loop: true,
              align: "center",
              skipSnaps: false,
              dragFree: false,
            }}
            className="w-full overflow-hidden"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full">
                  <div className="w-full">
                    {/* Speech bubble */}
                    <div className={`${testimonial.bgColor} p-4 md:p-6 rounded-2xl shadow-md w-full mx-auto max-w-3xl`}>
                      {/* Content */}
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="bg-white p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow-md transition-shadow mx-auto sm:mx-0 flex-shrink-0">
                          <User className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-600">{testimonial.role}</h3>
                          <div className="font-bold text-gray-800 uppercase text-sm md:text-base">{testimonial.name}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-4 leading-relaxed text-sm md:text-base text-center sm:text-left">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === current ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
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