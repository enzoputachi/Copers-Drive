
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PassengerInfoType, Path, useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
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
  const { passengers, passengerInfo, setPassengerInfo } = useBookingStore();

  // Create a dynamic form schema based on the number of passengers
  const createFormSchema = () => {
    if (passengers <= 1) {
      return z.object({
        primaryPassenger: passengerSchema,
      });
    }

    // For multiple passengers, create a schema with labeled passengers
    const schemaShape: Record<string, z.ZodType<PassengerFormDetails>> = {
      primaryPassenger: passengerSchema,
    };

    for (let i = 1; i < passengers; i++) {
      schemaShape[`additionalPassenger${i}`] = passengerSchema;
    }

    return z.object(schemaShape);
  };

  // Get the schema for the current number of passengers
  const formSchema = createFormSchema();

  type PassengerFormData = z.infer<typeof formSchema>;
  
  // Create properly typed defaultValues
  const createDefaultValues = () => {
    const defaultValues: Record<string, PassengerFormDetails> = {
      primaryPassenger: passengerInfo?.primaryPassenger || {
        fullName: "",
        email: "",
        phone: "",
        nextOfKinName: "",
        nextOfKinPhone: "",
      }
    };
    
    // Add additional passengers if needed
    for (let i = 1; i < passengers; i++) {
      const key = `additionalPassenger${i}`;
      defaultValues[key] = passengerInfo?.[key] || {
        fullName: "",
        email: "",
        phone: "",
        nextOfKinName: "",
        nextOfKinPhone: "",
      };
    }
    
    return defaultValues;
  };

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
    onComplete();
  };

  
  

  // Generate passenger form sections
  const renderPassengerForms = () => {
    const forms = [];

    // Primary passenger
    forms.push(
      <div key="primary" className="mb-8">
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
      </div>
    );

    // Additional passengers
    for (let i = 1; i < passengers; i++) {
      const passengerKey = `additionalPassenger${i}`;
      
      forms.push(
        <div key={passengerKey} className="mb-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Passenger {i + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name={`${passengerKey}.fullName` as Path<PassengerFormData>}
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
              name={`${passengerKey}.email` as Path<PassengerFormData>}
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
              name={`${passengerKey}.phone` as Path<PassengerFormData>}
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
                name={`${passengerKey}.nextOfKinName` as Path<PassengerFormData>}
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
                name={`${passengerKey}.nextOfKinPhone` as Path<PassengerFormData>}
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
        </div>
      );
    }

    return forms;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderPassengerForms()}
          
          <Button type="submit" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PassengerInfo;
