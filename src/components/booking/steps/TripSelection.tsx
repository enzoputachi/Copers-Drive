
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



// Nigerian locations
const locations = [
  "Lagos", "Abuja", "Port Harcourt", "Kaduna", "Owerri",
  "Enugu", "Benin City", "Uyo", "Calabar", "Kano"
];

// Schema for trip selection form
const tripSelectionSchema = z.object({
  tripType: z.enum(["oneWay", "roundTrip"]),
  departure: z.string().min(1, "Departure location is required"),
  destination: z.string().min(1, "Destination location is required"),
  departureDate: z.date({
    required_error: "Departure date is required",
  }),
  returnDate: z.date().optional().refine(
    (date) => {
      if (!date) return true; // If no date provided, skip validation
      return true; // Otherwise perform validation
    },
    {
      message: "Return date must be after departure date",
      path: ["returnDate"],
    }
  ).optional(),
  passengers: z.number().int().min(1, "At least one passenger is required").max(10, "Maximum 10 passengers allowed"),
});

// Props for TripSelection component
interface TripSelectionProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

const TripSelection = ({ onComplete, setStepComplete }: TripSelectionProps) => {
  const { 
    departure, 
    destination, 
    date: storeDate, 
    returnDate: storeReturnDate,
    passengers,
    tripType: storeTripType,
    setDeparture, 
    setDestination, 
    setDate,
    setReturnDate,
    setPassengers,
    setTripType
  } = useBookingStore();

  // Track whether returnDate should be shown
  const [isRoundTrip, setIsRoundTrip] = useState(storeTripType === "roundTrip");

  // Initialize form with existing store data
  const form = useForm<z.infer<typeof tripSelectionSchema>>({
    mode: "onChange",
    resolver: zodResolver(tripSelectionSchema),
    defaultValues: {
      tripType: storeTripType || "oneWay",
      departure: departure || "",
      destination: destination || "",
      departureDate: storeDate || undefined,
      returnDate: storeReturnDate || undefined,
      passengers: passengers || 1,
    },
  });

  const {
    formState: { isValid },
  } = form;

   // Ref to remember last validity
  const lastValidRef = useRef<boolean>();

  // Monitor form validity to enable/disable the next button
  useEffect(() => {
    // console.log("effect triggered; lastValid =", lastValidRef.current, "→", isValid) 
    // setStepComplete("tripSelection", isValid);   
    if (lastValidRef.current !== isValid) {
      setStepComplete("tripSelection", isValid);
      lastValidRef.current = isValid;
    }
  }, [isValid, setStepComplete]);

  // Handle trip type change
  const handleTripTypeChange = (value: "oneWay" | "roundTrip") => {
    setIsRoundTrip(value === "roundTrip");
    // If switching to one-way, clear return date
    if (value === "oneWay") {
      form.setValue("returnDate", undefined);
      setReturnDate(null);
    }
  };

  // Submit form data
  const onSubmit = (data: z.infer<typeof tripSelectionSchema>) => {
    // Update store with form values
    setTripType(data.tripType);
    setDeparture(data.departure);
    setDestination(data.destination);
    setDate(data.departureDate);
    setReturnDate(data.returnDate || null);
    setPassengers(data.passengers);
    
    
    // Proceed to next step
    onComplete();
  };

  console.log("For Data", form.getValues()) 

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type */}
          <FormField
            control={form.control}
            name="tripType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Trip Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: "oneWay" | "roundTrip") => {
                      field.onChange(value);
                      handleTripTypeChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="oneWay" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        One Way
                      </FormLabel>
                    </FormItem>
                    {/* <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="roundTrip" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Round Trip
                      </FormLabel>
                    </FormItem> */}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departure and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select departure location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations
                        .filter(loc => loc !== form.getValues("departure"))
                        .map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isRoundTrip && (
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const departureDate = form.getValues("departureDate");
                            return date < (departureDate || new Date());
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Passengers */}
          <FormField
            control={form.control}
            name="passengers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Passengers</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of passengers" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Continue to Select Bus
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TripSelection;
