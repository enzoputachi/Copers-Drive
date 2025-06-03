
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useBookingStore } from "@/stores/bookingStore";
import { routesApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { boolean } from "zod";

interface BusSelectionProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

interface BusOption {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  availableSeats: number;
  busName: string;
  amenities: string[];
}

const USE_MOCK_DATA = true;

const BusSelection = ({ onComplete, setStepComplete }: BusSelectionProps) => {
  const { 
    departure, 
    destination, 
    date, 
    tripType,
    returnDate,
    setSelectedBus,
    selectedBus
  } = useBookingStore();
  
  const [localSelectedBus, setLocalSelectedBus] = useState<string | null>(selectedBus?.id || null);

  // 2. Create a ref to hold the **last** completeness status
  const lastCompleteRef = useRef<boolean>();  
  //    └─ starts as `undefined`

  // Format date for API query
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  // Fetch available buses for the selected route and date
  const { data, isLoading, error } = useQuery({
    queryKey: ["buses", departure, destination, formattedDate],
    queryFn: () => {
      if (!departure || !destination || !formattedDate) {
        throw new Error("Missing required search parameters");
      }
      
      return routesApi.searchRoutes({
        departure,
        destination,
        date: formattedDate
      }).then(res => {
        // Mock data processing since we're using a mock API
        return res.data.buses || [];
      });
    },
    enabled: !USE_MOCK_DATA && !!departure && !!destination && !!formattedDate,
    meta: {
      onError: (err: Error) => {
        toast.error(`Error fetching buses: ${err.message}`);
      }
    }
  });

  // Sample data for testing when API isn't available
  const mockBuses: BusOption[] = [
    {
      id: "bus-001",
      departureTime: "07:00 AM",
      arrivalTime: "10:30 AM",
      duration: "3h 30m",
      price: 5500,
      busType: "Standard",
      availableSeats: 23,
      busName: "Copers Drive Express",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging"]
    },
    {
      id: "bus-002",
      departureTime: "09:15 AM",
      arrivalTime: "12:45 PM",
      duration: "3h 30m",
      price: 8000,
      busType: "Executive",
      availableSeats: 15,
      busName: "Copers Drive Premium",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging", "Refreshments", "Extra Legroom"]
    },
    {
      id: "bus-003",
      departureTime: "11:30 AM",
      arrivalTime: "03:00 PM",
      duration: "3h 30m",
      price: 12000,
      busType: "VIP",
      availableSeats: 8,
      busName: "Copers Drive Luxury",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging", "Refreshments", "Extra Legroom", "Personal TV", "Reclining Seats"]
    },
    {
      id: "bus-004",
      departureTime: "02:00 PM",
      arrivalTime: "05:30 PM",
      duration: "3h 30m",
      price: 5500,
      busType: "Standard",
      availableSeats: 28,
      busName: "Copers Drive Express",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging"]
    }
  ];

  // Use the buses from the API response if available, otherwise use mock data
  // const buses = data?.length ? data : mockBuses;
  const buses = USE_MOCK_DATA ? mockBuses : (data?.length ? data : []);


  // Update step completion status based on bus selection
  useEffect(() => {
    const isComplete = !!localSelectedBus;
    if (lastCompleteRef.current !== isComplete) {
        setStepComplete("busSelection", isComplete);
        lastCompleteRef.current = isComplete;
      }

  }, [localSelectedBus, setStepComplete]);

  // Handle bus selection
  const handleSelectBus = (bus: BusOption) => {
    setLocalSelectedBus(bus.id);
    setSelectedBus(bus);
  };

  console.log("Bus Data", localSelectedBus);
  

  // Handle continue button click
  const handleContinue = () => {
    if (localSelectedBus) {

      onComplete();
    } else {
      toast.error("Please select a bus to continue");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="mt-4 md:mt-0">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>Sorry, we couldn't load the available buses. Please try again.</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-lg">
          {departure} to {destination}
        </h3>
        <p className="text-gray-600">
          {date ? format(date, "EEEE, MMMM d, yyyy") : "Date not selected"}
        </p>
      </div>
      
      {buses.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6">
          <p>No buses available for this route on the selected date. Please try another date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                localSelectedBus === bus.id
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-gray-400"
              }`}
              onClick={() => handleSelectBus(bus)}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{bus.busName}</h3>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {bus.busType}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex flex-col md:flex-row md:items-center md:space-x-6">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                      <span className="font-medium">{bus.departureTime}</span>
                      <span className="hidden md:inline">→</span>
                      <span className="font-medium">{bus.arrivalTime}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Duration: {bus.duration}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <span>{bus.availableSeats} seats available</span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="bg-gray-50 text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end justify-between">
                  <div className="text-xl font-bold">
                    ₦{bus.price.toLocaleString()}
                  </div>
                  {localSelectedBus === bus.id && (
                    <div className="mt-2 text-primary text-sm font-medium">
                      Selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button 
          onClick={handleContinue}
          disabled={!localSelectedBus}
          className="w-full"
        >
          Continue to Seat Selection
        </Button>
      </div>
    </div>
  );
};

export default BusSelection;
