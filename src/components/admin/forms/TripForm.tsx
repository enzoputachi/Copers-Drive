
import React, { useEffect, useState } from "react";
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

// Mock data for routes and buses
// const routes = [
//   { id: "1", name: "Lagos to Abuja" },
//   { id: "2", name: "Lagos to Ibadan" },
//   { id: "3", name: "Abuja to Kaduna" },
//   { id: "4", name: "Lagos to Benin" },
//   { id: "5", name: "Port Harcourt to Calabar" },
// ];

// const buses = [
//   { id: "1", plateNo: "ABC-123XY" },
//   { id: "2", plateNo: "DEF-456XY" },
//   { id: "3", plateNo: "GHI-789XY" },
//   { id: "4", plateNo: "JKL-012XY" },
//   { id: "5", plateNo: "MNO-345XY" },
// ];



const STATUS_OPTIONS = ["scheduled", "completed", "canceled"] as const;

const tripSchema = z.object({
  routeId: z.string().min(1, "Route is required"),
  busId: z.string().min(1, "Bus is required"),
  departTime: z.string().min(1, "Departure time is required"),
  arriveTime: z.string().min(1, "Arrival time is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  // availableSeats: z.coerce.number().int().min(0, "Available seats must be non-negative"),
  status: z.enum(STATUS_OPTIONS).default("scheduled"),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface RouteOption {
  id: string;
  name: string,
}

interface BusOption {
  id: string;
  plateNo: string;
}

interface TripFormProps {
  defaultValues?: Partial<TripFormValues>;
  onSubmit: (data: {
    routeId: number;
    busId: number;
    departTime: Date;
    arriveTime: Date;
    price: number;
    status: "SCHEDULED"|"COMPLETED"|"CANCELED";
  }) => void;
  isSubmitting?: boolean;

  /**From API */
  routes: RouteOption[];
  buses: BusOption[];
}

const TripForm = ({ defaultValues, onSubmit, isSubmitting = false , routes, buses}: TripFormProps) => {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      routeId: "",
      busId: "",
      departTime: "",
      arriveTime: "",
      price: 0,
      // availableSeats: 0,
      status: "scheduled",
      ...defaultValues,
    },
  });

  // Helper to format datetime-local input
  const formatDateTimeForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const handleFormSubmit = (data: TripFormValues) => {
    // 1) parse IDs
    const routeIdNum = parseInt(data.routeId, 10);
    const busIdNum   = parseInt(data.busId,   10);

    // 2) build JS Dates (includes seconds & timezone)
    const departDate = new Date(data.departTime);
    const arriveDate = new Date(data.arriveTime);

    // 3) uppercase your status to match Prisma enum
    const prismaStatus = data.status.toUpperCase() as
      | "SCHEDULED"
      | "COMPLETED"
      | "CANCELED";

    onSubmit({
      routeId:    routeIdNum,
      busId:      busIdNum,
      departTime: departDate,
      arriveTime: arriveDate,
      price:      data.price,
      status:     prismaStatus,
    });
  };

  useEffect(() => {
    if (defaultValues?.departTime) {
      form.setValue("departTime", formatDateTimeForInput(defaultValues.departTime));
    }
    if (defaultValues?.arriveTime) {
      form.setValue("arriveTime", formatDateTimeForInput(defaultValues.arriveTime));
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="routeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

          {/*  ——— Bus Select ——— */}
        <FormField
          control={form.control}
          name="busId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.plateNo}
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
          name="departTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arriveTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (₦)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="availableSeats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Seats</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Trip"}
        </Button>
      </form>
    </Form>
  );
};

export default TripForm;
