// src/components/TripSelection.tsx
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
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
import { useListRoutes, useSearchTripsByRoute } from "@/hooks/useApi";

// Nigerian locations
const locations = [
  "Jibowu, Lagos State", "Lagos", "Abuja", "Umuawulu, Anambra State", "Kaduna", "Owerri",
  "Enugu", "Benin City", "Abijan", "Calabar", "London"
];

// Schema
const tripSelectionSchema = z.object({
  tripType: z.enum(["oneWay","roundTrip"]),
  departure: z.string().min(1, "Departure is required"),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.date({ required_error: "Departure date is required" }),
  returnDate: z
    .date()
    .optional()
    .refine((date) => !date || true, {
      message: "Return date must be after departure date",
      path: ["returnDate"],
    }),
  passengers: z
    .number()
    .int()
    .min(1, "At least one passenger")
    .max(10, "Max 10 passengers"),
});
type FormValues = z.infer<typeof tripSelectionSchema>;

interface Props {
  onComplete: (results: any[]) => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

export default function TripSelection({ onComplete, setStepComplete }: Props) {
  const { data: routes = [], isLoading, error } = useListRoutes();
  const routeArrays = routes?.data?.data

  // store state + setters
  const {
    departure,
    destination,
    date,
    returnDate,
    passengers,
    tripType,
    setDeparture,
    setDestination,
    setDate,
    setReturnDate,
    setPassengers,
    setTripType,
  } = useBookingStore();

  // form
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(tripSelectionSchema),
    defaultValues: {
      tripType: tripType || "oneWay",
      departure: departure || "",
      destination: destination || "",
      departureDate: date!,
      returnDate: returnDate || undefined,
      passengers: passengers || 1,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = form;

  // keep parent step enabled/disabled in sync
  const lastValid = useRef<boolean>();
  useEffect(() => {
    if (lastValid.current !== isValid) {
      setStepComplete("tripSelection", isValid);
      lastValid.current = isValid;
    }
  }, [isValid, setStepComplete]);

  // round‑trip toggle
  const [isRoundTrip, setIsRoundTrip] = useState(tripType === "roundTrip");
  const onTripTypeChange = (val: "oneWay" | "roundTrip") => {
    setIsRoundTrip(val === "roundTrip");
    form.setValue("tripType", val);
    setTripType(val);
    if (val === "oneWay") {
      form.setValue("returnDate", undefined);
      setReturnDate(null);
    }
  };

  const watchedDeparture = watch("departure");
  const watchedDestination = watch("destination");
  const watchedDepDate = watch("departureDate");  // may be undefined

  // build an ISO date string only if we have a Date
  const depDateString = watchedDepDate
    ? format(watchedDepDate, "yyyy-MM-dd")        // using date-fns
    : "";

  // React Query search hook (starts disabled)
  const { refetch: searchRoutes, data, isFetching, isError } = useSearchTripsByRoute({
    origin: watchedDeparture,
    destination: watchedDestination,
    date: depDateString,
  });

  console.log("Trip list:", data );
  

  // on submit: persist store + call API + next
  const onSubmit = async (formData: FormValues) => {
    // save into store
    setTripType(formData.tripType);
    setDeparture(formData.departure);
    setDestination(formData.destination);
    setDate(formData.departureDate);
    setReturnDate(formData.returnDate || null);
    setPassengers(formData.passengers);

    // console.log("Trip Form data:", formData)

    // fetch matching routes
    const res = await searchRoutes();

    const routesArray = res?.data ?? [];

    onComplete(routesArray);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type */}
          <FormField
            control={control}
            name="tripType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Type</FormLabel>
                <RadioGroup
                  {...field}
                  onValueChange={onTripTypeChange}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="oneWay" />
                    </FormControl>
                    <FormLabel>One Way</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="roundTrip" />
                    </FormControl>
                    <FormLabel>Round Trip</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departure & Destination */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select departure" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="">
                      {Array.isArray(routeArrays) && routeArrays.map((route) => (
                        <SelectItem key={route.id} value={route.origin}>
                          {route.origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(routeArrays) && routeArrays
                        .filter((route) => route !== watch("departure"))
                        .map((route) => (
                          <SelectItem key={route.id} value={route.destination}>
                            {route.destination}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Pickers */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full text-left", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(d) => d < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRoundTrip && (
              <FormField
                control={control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full text-left", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(d) => d < watch("departureDate")}
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
            control={control}
            name="passengers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passengers</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {n > 1 ? "Passengers" : "Passenger"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isFetching}>
            {isFetching ? "Searching…" : "Continue"}
          </Button>
          {isError && (
            <p className="mt-2 text-sm text-red-600">
              Unable to fetch routes. Please try again.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
