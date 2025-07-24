
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBookingStore } from "@/stores/bookingStore";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { useListRoutes } from "@/hooks/useApi";

const locations = [
  "Jibowu, Lagos State", "Lagos", "Abuja", "Umuawulu,	Anambra State", "Kaduna", "Owerri",
  "Enugu", "Benin City", "Abijan", "Calabar", "London"
];

const bookingSchema = z.object({
  departure: z.string().min(1, "Departure location is required"),
  destination: z.string().min(1, "Destination location is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  passengers: z.number().int().min(1).max(13),
  seatClass: z.enum(["Standard", "Executive", "VIP"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { data: routes, isLoading, error } = useListRoutes();
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([])
  const routesArrays = routes?.data?.data || [];
  // console.log('Routes:', routesArrays, 'Loading:', isLoading, 'Error:', error);

    
  const { 
    departure, 
    destination, 
    date: storeDate,
    passengers, 
    seatClass,
    setDeparture, 
    setDestination, 
    setDate: setBookingDate,
    setPassengers,
    setSeatClass,
    setPaymentType,
  } = useBookingStore();


  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      departure: departure || "",
      destination: destination || "",
      passengers: passengers || 1,
      seatClass: seatClass || "Standard",
      date: undefined,
    }
  });

  // Important: Register the date with react-hook-form
  // useEffect(() => {
  //   if (storeDate) {
  //     setValue("date", storeDate);
  //   }
  // }, [storeDate, setValue]);

  const selectedDate = watch("date");
  const origin = watch("departure")

  // extract unique origin
  const uniqueOrigins = [...new Set(routesArrays.map(route => route.origin))] as string[];

  const slides = [
    {
      image: "/cm1.jpeg",
      alt: "Corpers Drive luxury bus"
    },
    {
      image: "/cm2.jpeg",
      alt: "NYSC corps members traveling"
    },
    {
      image: "/cm2.jpeg",
      alt: "Modern transportation hub"
    }
  ];

  const paymentTypes = routesArrays.map(item => item.paymentType)
  // setPaymentType(paymentTypes)


  

  // Rotate through slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);



  const onSubmit = (data: BookingFormData) => {
    setDeparture(data.departure);
    setDestination(data.destination);
    setBookingDate(data.date);
    setPassengers(data.passengers);
    setSeatClass(data.seatClass);
    
      const matchedRoute = routesArrays.find(
        (route) =>
          route.origin === data.departure &&
          route.destination === data.destination
      );

      if (matchedRoute?.paymentType) {
        // Normalize and store as lowercase string
        const paymentType = matchedRoute.paymentType;
        setPaymentType(paymentType);
        console.log("Real:", paymentType)
      } else {
        setPaymentType("Full"); // fallback default
      }
    
    toast.success("Searching route...");
    navigate("/booking");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("date", date, { shouldValidate: true });
      setBookingDate(date);
    }
  };

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load routes</h2>
        <p className="text-lg">Please try again later or contact support.</p>
      </section>
    );
  }


  return (
    <section className="relative">
      {/* Hero Banner */}
      <div className="relative h-[700px] md:h-[600px] overflow-hidden">
         {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 z-2' : 'opacity-0 z-0'}
            `}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
            aria-hidden="true"
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true" />
      
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl">
            <img className="hidden border rounded-2xl" src="/bg.jpg" alt="" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {/* Safe Travels for NYSC Corps Members */}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {/* Reliable transportation to and from NYSC orientation camps across Nigeria */}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Widget */}
      <div className="container mx-auto px-6 mb-[1.5rem]">
        <div className="relative -mt-[40rem] md:-mt-[30rem] bg-white/60 backdrop-blur-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto shadow-2xl drop-shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Trip</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure */}
              <div className="space-y-4">
                <Label htmlFor="departure">Departure Location</Label>
                <select
                  id="departure"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-space-y-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("departure", {
                    onChange: (e) => {
                      const selectedOrigin = e.target.value;
                      setDeparture(selectedOrigin);

                      // filter destinations for that origin
                      const destinations = routesArrays
                        .filter(route => route.origin == selectedOrigin)
                        .map(route => route.destination);

                      setFilteredDestinations([...new Set(destinations)] as string[])
                      setValue("destination", "");
                    }
                  })}
                >
                  <option value="">Select departure</option>
                  {uniqueOrigins.map((origin) => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
                {errors.departure && (
                  <p className="text-sm font-medium text-destructive">{errors.departure.message}</p>
                )}
              </div>
              
              {/* Destination */}
              <div className="space-y-4">
                <Label htmlFor="destination">Destination</Label>
                <select
                  id="destination"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-space-y-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("destination", {
                    onChange: (e) => setDestination(e.target.value)
                  })}
                  disabled={!filteredDestinations.length}
                >
                  <option value="">Select destination</option>
                  {filteredDestinations.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
                {errors.destination && (
                  <p className="text-sm font-medium text-destructive">{errors.destination.message}</p>
                )}
              </div>
              
              {/* Date Picker */}
              <div className="space-y-4">
                <Label htmlFor="date">Travel Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      id="date"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm font-medium text-destructive">{errors.date.message}</p>
                )}
              </div>
              
              {/* Passengers */}
              <div className="space-y-4">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <select
                  id="passengers"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-space-y-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("passengers", { 
                    valueAsNumber: true,
                    onChange: (e) => setPassengers(parseInt(e.target.value))
                  })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                {errors.passengers && (
                  <p className="text-sm font-medium text-destructive">{errors.passengers.message}</p>
                )}
              </div>
              
              {/* Seat Class */}
              <div className="space-y-4 md:col-span-2 hidden">
                <Label htmlFor="seatClass">Seat Class</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["Standard"].map((cls) => (
                    <label 
                      key={cls}
                      className={`
                        flex items-center justify-center px-4 py-4 border rounded-md cursor-pointer
                        ${seatClass === cls ? 'border-primary bg-primary/10' : 'border-gray-space-y-400 hover:bg-gray-50'}
                      `}
                    >
                      <input 
                        type="radio" 
                        value={cls} 
                        className="sr-only"
                        {...register("seatClass", {
                          onChange: (e) => setSeatClass(e.target.value as any)
                        })}
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
                {errors.seatClass && (
                  <p className="text-sm font-medium text-destructive">{errors.seatClass.message}</p>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-[2rem]">
              <Button type="submit" className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                Continue to Booking
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
