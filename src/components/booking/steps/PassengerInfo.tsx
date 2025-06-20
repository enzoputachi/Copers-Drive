
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PassengerInfoType, Path, useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { useCreateBookingDraft } from "@/hooks/useApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PassengerInfoProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}


// Base schema for a single passenger
const passengerSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  nextOfKinName: z.string().min(3, "Next of kin name is required"),
  nextOfKinPhone: z.string().min(10, "Next of kin phone number must be at least 10 digits"),
});

// Type for a single passenger's details
type PassengerFormDetails = z.infer<typeof passengerSchema>;

const PassengerInfo = ({ onComplete, setStepComplete }: PassengerInfoProps) => {
  const { passengers, passengerInfo, setPassengerInfo, setSubmittedPassengerData, selectedBus, selectedSeats } = useBookingStore();
  const { mutate: createDraft, status: mutationStatus, error} = useCreateBookingDraft();

  const isLoading = mutationStatus === "pending";
  const isError   = mutationStatus === "error";

  // Create a dynamic form schema based on the number of passengers
  const createFormSchema = () => {
    return z.object({
      primaryPassenger: passengerSchema,
    });
  };

  // Get the schema for the current number of passengers
  const formSchema = createFormSchema();

  type PassengerFormData = z.infer<typeof formSchema>;
  
  // Create properly typed defaultValues
  const createDefaultValues = () => ({
        primaryPassenger: passengerInfo?.primaryPassenger || {
        fullName: "",
        email: "",
        phone: "",
        nextOfKinName: "",
        nextOfKinPhone: "",
      }
  });

  // Initialize form with existing data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
    mode: "onChange",
  });

  // Check form validity to update step completion status
  useEffect(() => {
    const subscription = form.watch(() => {
      const { isValid } = form.formState;
      setStepComplete("passengerInfo", isValid);
    });

    console.log("Passenger info", passengerInfo);
    
    return () => subscription.unsubscribe();
  }, [form, setStepComplete, passengerInfo]);

  // Handle form submission
  const onSubmit = (data: PassengerFormData) => {
    // Explicitly cast the data to match the PassengerInfo type
    setPassengerInfo(data as PassengerInfoType);
    const seatIds = selectedSeats.map(seat => seat.seatId);

    const draftPayload = {
      tripId: Number(selectedBus.id),         // from your booking store
      seatId: seatIds,                         // likewise  
      passengerName: data.primaryPassenger.fullName,
      email:         data.primaryPassenger.email,
      mobile:         data.primaryPassenger.phone,
      nextOfKinName:  data.primaryPassenger.nextOfKinName,
      nextOfKinPhone: data.primaryPassenger.nextOfKinPhone,
    }

    console.log("draft payload:", draftPayload);

    createDraft(draftPayload, {
      onSuccess: () => {
        setSubmittedPassengerData(true);
        onComplete();
      },
      onError: (err) => {
        console.error("Failed to save draft", err);        
      }
    })

    // setSubmittedPassengerData(true);
    // onComplete();
  };

  
  
  // Generate passenger form sections
  const renderPassengerForms = () => {

    // Primary passenger    
    return (<div key="primary" className="mb-8">
      <h3 className="text-lg font-medium mb-4">Primary Passenger</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="primaryPassenger.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryPassenger.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryPassenger.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="primaryPassenger.nextOfKinName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next of Kin Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter next of kin name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryPassenger.nextOfKinPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next of Kin Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter next of kin phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>)
    
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderPassengerForms()}

           {/* Error message goes here */}
          {error && (
            <p className="text-red-600 mt-2">
              Oops, we couldn’t save your info—please try again.
            </p>
          )}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Continue to Payment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PassengerInfo;
