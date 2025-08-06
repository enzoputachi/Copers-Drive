import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTrips } from "@/hooks/useAdminQueries";
import { useAdminCreateBooking } from "@/hooks/useAdminQueries"; // Add this import

const manualBookingSchema = z.object({
  tripId: z.string().min(1, "Trip selection is required"),
  seatId: z.string().min(1, "Seat selection is required"),
  passengerName: z.string().min(2, "Passenger name is required"),
  passengerAddress: z.string().min(5, "Passenger address is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  nextOfKinName: z.string().min(2, "Next of kin name is required"),
  nextOfKinPhone: z.string().min(10, "Next of kin phone is required"),
  isPaymentComplete: z.boolean().default(true),
  amountPaid: z.string().default("0"),
  amountDue: z.string().default("0"),
});

type ManualBookingFormValues = z.infer<typeof manualBookingSchema>;

// Remove local interfaces and use the imported types from your API
// The Trip type should be imported from your API service

interface ManualBookingFormProps {
  onCancel: () => void;
  onSuccess?: () => void; // Optional callback for when booking is created successfully
}

const ManualBookingForm = ({ onCancel, onSuccess }: ManualBookingFormProps) => {
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Mutation hook for creating booking
  const createBookingMutation = useAdminCreateBooking();

  const form = useForm<ManualBookingFormValues>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      tripId: "",
      seatId: "",
      passengerName: "",
      passengerAddress: "",
      email: "",
      mobile: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      isPaymentComplete: true,
      amountPaid: "0",
      amountDue: "0",
    },
  });

  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const selectedTripId = form.watch("tripId");

  // Find selected trip and get available seats
  const selectedTrip = useMemo(
    () => trips.find((t) => String(t.id) === selectedTripId) || null,
    [trips, selectedTripId]
  );

  const availableSeats = useMemo(() => {
    if (!selectedTrip?.seats) return [];
    return selectedTrip.seats.filter((s) => s.status === "AVAILABLE");
  }, [selectedTrip]);

  // Reset seat selection when trip changes
  useEffect(() => {
    if (selectedTripId) {
      form.setValue("seatId", "");
    }
  }, [selectedTripId, form]);

  useEffect(() => {
    if (selectedTrip) {
      const tripPrice = selectedTrip.price;
      const isPaymentComplete = form.watch("isPaymentComplete");

      form.setValue(
        "amountPaid",
        isPaymentComplete ? tripPrice.toString() : "0"
      );
      form.setValue(
        "amountDue",
        isPaymentComplete ? "0" : tripPrice.toString()
      );
    }
  }, [selectedTrip, form]);

  const isPaymentComplete = form.watch("isPaymentComplete");

  // Also update when payment status changes
  useEffect(() => {
    if (selectedTrip) {
      const tripPrice = selectedTrip.price;
      const isPaymentComplete = form.watch("isPaymentComplete");

      form.setValue(
        "amountPaid",
        isPaymentComplete ? tripPrice.toString() : "0"
      );
      form.setValue(
        "amountDue",
        isPaymentComplete ? "0" : tripPrice.toString()
      );
    }
  }, [isPaymentComplete, selectedTrip, form]);

  const handleFormSubmit = (data: ManualBookingFormValues) => {
    const tripPrice = selectedTrip?.price || 0;

    const bookingData = {
      tripId: Number(data.tripId),
      seatId: Number(data.seatId),
      passengerName: data.passengerName.trim(),
      passengerAddress: data.passengerAddress.trim(),
      email: data.email.toLowerCase().trim(),
      mobile: data.mobile.trim(),
      nextOfKinName: data.nextOfKinName.trim(),
      nextOfKinPhone: data.nextOfKinPhone.trim(),
      isPaymentComplete: data.isPaymentComplete,
      amountPaid: parseFloat(data.amountPaid) || 0,
      amountDue: parseFloat(data.amountDue) || 0,
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: () => {
        form.reset(); // Reset form after successful submission
        onSuccess?.(); // Call optional success callback
      },
    });
  };

  if (tripsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-4 max-h-[70vh] overflow-y-auto"
      >
        {/* Trip Selection */}
        <FormField
          control={form.control}
          name="tripId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Trip *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("seatId", "");
                }}
                value={field.value}
                disabled={trips.length === 0 || createBookingMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        trips.length === 0
                          ? "No trips available"
                          : "Choose a trip"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trips.map((trip) => (
                    <SelectItem key={trip.id} value={String(trip.id)}>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">
                          {typeof trip.route === "string"
                            ? trip.route
                            : `${trip.route.origin} → ${trip.route.destination}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(trip.departTime).toLocaleString()} •{" "}
                          {trip.bus.plateNo} • ₦{trip.price.toLocaleString()} •{" "}
                          {trip.seats?.filter((s) => s.status === "AVAILABLE")
                            .length || 0}{" "}
                          seats available
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seat Selection */}
        <FormField
          control={form.control}
          name="seatId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Seat *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={
                  !selectedTripId ||
                  loadingSeats ||
                  availableSeats.length === 0 ||
                  createBookingMutation.isPending
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedTripId
                          ? "Select a trip first"
                          : loadingSeats
                          ? "Loading seats..."
                          : availableSeats.length === 0
                          ? "No seats available"
                          : "Choose a seat"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSeats.map((seat) => (
                    <SelectItem key={seat.id} value={String(seat.id)}>
                      Seat {seat.seatNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {selectedTrip && (
                <p className="text-sm text-gray-600">
                  Trip Price: ₦{selectedTrip.price.toLocaleString()}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Passenger Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Passenger Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="passengerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter passenger's full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="passenger@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+234XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="passengerAddress"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Address *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter passenger's full address"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Next of Kin Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Emergency Contact</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nextOfKinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency contact name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextOfKinPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+234XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Payment & Admin Settings */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Payment & Notes</h3>

          <FormField
            control={form.control}
            name="isPaymentComplete"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mark as Paid</FormLabel>
                  <div className="text-sm text-gray-600">
                    Toggle if payment has been received (cash, transfer, etc.)
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid (₦)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountDue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Due (₦)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Error Message Display */}
        {createBookingMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">
              Failed to create booking. Please try again.
              {createBookingMutation.error instanceof Error && (
                <span className="block text-xs mt-1">
                  {createBookingMutation.error.message}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createBookingMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createBookingMutation.isPending ||
              !selectedTripId ||
              !form.watch("seatId")
            }
          >
            {createBookingMutation.isPending
              ? "Creating Booking..."
              : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualBookingForm;