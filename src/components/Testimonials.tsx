
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Chioma Okafor",
    role: "NYSC Corps Member - Lagos",
    quote: "Copers Drive made my journey to the NYSC orientation camp stress-free and comfortable. The online booking was easy and the bus was clean and comfortable.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 2,
    name: "Emmanuel Adebayo",
    role: "NYSC Corps Member - Abuja",
    quote: "I was worried about finding reliable transportation to camp, but Copers Drive exceeded my expectations. The staff were friendly and the journey was smooth.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Blessing Nwachukwu",
    role: "NYSC Corps Member - Kaduna",
    quote: "The special NYSC discount saved me a lot of money. I've been recommending Copers Drive to all my friends heading to camp.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 4,
    name: "Oluwaseun Ogunleye",
    role: "NYSC Corps Member - Enugu",
    quote: "The e-ticket system was so convenient, and the reminders helped me prepare for my journey. Copers Drive really understands corps members' needs.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from NYSC corps members who have traveled with Copers Drive
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel 
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-8">
                  <div className="flex items-start gap-10 max-w-4xl">
                  {/* Image (outside bubble) */}
                  <img
                    src={testimonial.avatr}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  {/* Speech bubble */}
                  <div className="relative bg-white p-6 rounded-2xl shadow-md ml-6">
                    {/* Triangle (bubble tail) */}

                          <div className="absolute left-0 top-[2rem] -translate-x-full">
                            <div className="w-0 h- border-t-[0rem] border-b-[3rem] border-r-[2rem] border-transparent border-r-white"></div>
                          </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-600">{testimonial.role}</h3>
                    <div className="font-bold text-gray-800 uppercase">{testimonial.name}</div>
                    <p className="text-gray-700 mt-2">
                      {testimonial.quote}
                    </p>
                  </div>
                </div>

                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="mr-4" />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
