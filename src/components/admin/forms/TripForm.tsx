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

const STATUS_OPTIONS = ["scheduled", "completed", "canceled"] as const;

const tripSchema = z.object({
  routeId: z.string().min(1, "Route is required"),
  busId: z.string().min(1, "Bus is required"),
  departTime: z.string().min(1, "Departure time is required"),
  arriveTime: z.string().min(1, "Arrival time is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
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
  onCancel: () => void;
  routes: RouteOption[];
  buses: BusOption[];
}

const TripForm = ({ defaultValues, onSubmit, onCancel, isSubmitting = false , routes, buses}: TripFormProps) => {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      routeId: "",
      busId: "",
      departTime: "",
      arriveTime: "",
      price: 0,
      status: "scheduled",
      ...defaultValues,
    },
  });

  // Helper to format datetime-local input
  const formatDateTimeForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  const handleFormSubmit = (data: TripFormValues) => {
    const routeIdNum = parseInt(data.routeId, 10);
    const busIdNum   = parseInt(data.busId,   10);
    const departDate = new Date(data.departTime);
    const arriveDate = new Date(data.arriveTime);
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

  // Update form values when defaultValues change (for editing)
  useEffect(() => {
    if (defaultValues) {
      // Set all form values when editing
      Object.keys(defaultValues).forEach(key => {
        const value = defaultValues[key as keyof typeof defaultValues];
        if (value !== undefined) {
          if (key === 'departTime' || key === 'arriveTime') {
            form.setValue(key, formatDateTimeForInput(value as string));
          } else {
            form.setValue(key as keyof TripFormValues, value);
          }
        }
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="routeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        <FormField
          control={form.control}
          name="busId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Trip"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TripForm;