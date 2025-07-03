
import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const PAYMENT_TYPES = ["Full", "Split"] as const;

const routeSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  distanceKm: z.coerce.number().min(1, "Distance must be at least 1 km"),
  duration: z.string().min(1, "Duration is required"),
  paymentType: z.enum(PAYMENT_TYPES),
  isActive: z.boolean().default(true),
});

type RouteFormValues = z.infer<typeof routeSchema>;

interface RouteFormProps {
  defaultValues?: RouteFormValues;
  onSubmit: (data: RouteFormValues) => void;
  isSubmitting?: boolean;
}

const RouteForm = ({ defaultValues, onSubmit, isSubmitting = false }: RouteFormProps) => {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: defaultValues || {
      origin: "",
      destination: "",
      distanceKm: 0,
      duration: '',
      isActive: true,
      paymentType: "Full"
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin</FormLabel>
              <FormControl>
                <Input placeholder="Lagos" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="Abuja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="distanceKm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance (KM)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Hr)</FormLabel>
              <FormControl>
                <Input placeholder="14hrs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => {
                    const selectedType = e.target.value as keyof typeof PAYMENT_TYPES;
                    const config = PAYMENT_TYPES[selectedType];

                    field.onChange(selectedType);
                    form.setValue("paymentType", config[0]);
                    form.setValue("paymentType", config[1]);
                  }}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm"
                >
                  {PAYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active Status</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Set whether this route is currently active
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Route"}
        </Button>
      </form>
    </Form>
  );
};

export default RouteForm;
