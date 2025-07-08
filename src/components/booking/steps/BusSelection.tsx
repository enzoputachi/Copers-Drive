import { useEffect, useRef, useState } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { useSearchTripsByRoute } from "@/hooks/useApi";
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { Bus, Star, Crown, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface BusSelectionProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

interface TripOption {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType?: string;
  availableSeats?: number;
  busName?: string;
  amenities?: string[];
}

// Toggle for development: use mock data or real API
const USE_MOCK_DATA = false;

const BusSelection = ({ onComplete, setStepComplete }: BusSelectionProps) => {
  const {
    departure,
    destination,
    date,
    setDate,
    setSelectedBus,
    selectedBus,
  } = useBookingStore();
  
  // Initialize with empty state to avoid stale selections
  const [localSelectedBus, setLocalSelectedBus] = useState<string | null>(null);
  const lastCompleteRef = useRef<boolean>();
  
  // Track route changes to clear selections
  const previousRouteRef = useRef<string | null>(null);
  const previousDateRef = useRef<Date | null>(null);

  console.log("BusSelection mount - selectedBus from store:", selectedBus);
  console.log("BusSelection mount - localSelectedBus:", localSelectedBus);

  // Format date for API query
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  // Fetch trips (API)
  const { data: apiTripsRaw = [], isLoading, error } = useSearchTripsByRoute({
    origin: departure,
    destination,
    date: formattedDate,
  });

  console.log("apiTripsRaw:", apiTripsRaw, "payload:", departure, destination, formattedDate);

  // Clear selections when route or date changes
  useEffect(() => {
    const currentRoute = `${departure}-${destination}`;
    const currentDate = date;
    
    // Check if route changed
    if (previousRouteRef.current && previousRouteRef.current !== currentRoute) {
      console.log("Route changed, clearing bus selection");
      setLocalSelectedBus(null);
      setSelectedBus(null);
    }
    
    // Check if date changed
    if (previousDateRef.current && previousDateRef.current !== currentDate) {
      console.log("Date changed, clearing bus selection");
      setLocalSelectedBus(null);
      setSelectedBus(null);
    }
    
    previousRouteRef.current = currentRoute;
    previousDateRef.current = currentDate;
  }, [departure, destination, date, setSelectedBus]);

  // Initialize local state from store only if it matches current route/date
  useEffect(() => {
    const currentRoute = `${departure}-${destination}`;
    
    // Only restore selection if we have the same route and no local selection yet
    if (selectedBus?.id && 
        !localSelectedBus && 
        previousRouteRef.current === currentRoute &&
        previousDateRef.current === date) {
      setLocalSelectedBus(selectedBus.id);
    }
  }, [selectedBus?.id, localSelectedBus, departure, destination, date]);

  // Normalize API data into UI shape
  const apiTrips: TripOption[] = apiTripsRaw.map(trip => {
    const dep = parseISO(trip.departTime);
    const arr = parseISO(trip.arriveTime);
    const minutes = differenceInMinutes(arr, dep);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const availableSeats = Array.isArray(trip.seats)
      ? trip.seats.filter(seat => !seat.isBooked).length
      : undefined;

    return {
      id: String(trip.id),
      departureTime: format(dep, 'hh:mm a'),
      arrivalTime: format(arr, 'hh:mm a'),
      duration: `${hours}h ${mins}m`,
      price: trip.price,
      busType: trip.bus?.busType,
      availableSeats,
      busName: trip.bus?.plateNo,
      amenities: trip.bus?.amenities || [],
    };
  });

  // Mock data for offline/dev
  const mockTrips: TripOption[] = [
    {
      id: "1",
      departureTime: "07:00 AM",
      arrivalTime: "10:30 AM",
      duration: "3h 30m",
      price: 5500,
      busType: "Standard",
      availableSeats: 23,
      busName: "Corpers Drive Express",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging"],
    },
    {
      id: "2",
      departureTime: "09:15 AM",
      arrivalTime: "12:45 PM",
      duration: "3h 30m",
      price: 8000,
      busType: "Executive",
      availableSeats: 15,
      busName: "Corpers Drive Premium",
      amenities: ["Air Conditioned", "Free WiFi", "USB Charging", "Refreshments", "Extra Legroom"],
    },
    {
      id: "3",
      departureTime: "11:30 AM",
      arrivalTime: "03:00 PM",
      duration: "3h 30m",
      price: 12000,
      busType: "VIP",
      availableSeats: 8,
      busName: "Corpers Drive Luxury",
      amenities: [
        "Air Conditioned",
        "Free WiFi",
        "USB Charging",
        "Refreshments",
        "Extra Legroom",
        "Personal TV",
        "Reclining Seats",
      ],
    },
  ];

  // Decide which data source to use
  const trips = USE_MOCK_DATA ? mockTrips : apiTrips;

  // Update step completion status
  useEffect(() => {
    const isComplete = localSelectedBus !== null && selectedBus !== null;
    if (lastCompleteRef.current !== isComplete) {
      setStepComplete("busSelection", isComplete);
      lastCompleteRef.current = isComplete;
    }
  }, [localSelectedBus, selectedBus, setStepComplete]);

  // Handle selection
  const handleSelectBus = (trip: TripOption) => {
    setLocalSelectedBus(trip.id);
    setSelectedBus(trip as any);
  };

  // Handle date change
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // Clear bus selection when date changes
      setLocalSelectedBus(null);
      setSelectedBus(null);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setLocalSelectedBus(null);
    setSelectedBus(null);
  };

  // Continue handler
  const handleContinue = () => {
    if (localSelectedBus) {
      onComplete();
    } else {
      toast.error("Please select a bus to continue");
    }
  };

  // Show loading only if API in use
  if (!USE_MOCK_DATA && isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Show error only if API in use
  if (!USE_MOCK_DATA && error) {
    return ( 
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
        <p className="text-red-600">Failed to load trips. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Function to get bus image based on type
  const getBusImage = (busType?: string) => {
    switch (busType) {
      case "Sprinter":
        return <Bus className="h-6 w-6 text-gray-500" />;
      case "Coach":
        return <Bus className="h-6 w-6 text-gray-500" />;
      case "Mini Bus":
        return <Star className="h-6 w-6 text-gray-500" />;
      case "Standard":
      default:
        return <Bus className="h-6 w-6 text-gray-500" />;
    } 
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Bus</h2>
      <div className="mb-6">
        <h3 className="font-medium text-lg">
          {departure} to {destination}
        </h3>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-gray-600">Travel Date:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "EEEE, MMMM d, yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {localSelectedBus && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="text-red-600 hover:text-red-700"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
          <p>No trips found for this route on the selected date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleSelectBus(trip)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                localSelectedBus === trip.id
                  ? "border-primary ring-1 ring-primary bg-green-200"
                  : "hover:border-gray-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getBusImage(trip.busType)}
                  <div>
                    <h3 className="font-semibold">{trip.busType}</h3>
                    <p className="text-sm">
                      {trip.departureTime} → {trip.arrivalTime} ({trip.duration})
                    </p>
                    <p className="text-xs text-gray-600">
                      {trip.availableSeats} seats available
                    </p>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  ₦{trip.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleContinue} disabled={!localSelectedBus} className="w-full mt-6">
        Continue to Seat Selection
      </Button>
    </div>
  );
};

export default BusSelection;