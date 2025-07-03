
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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

const BUS_TYPE_CONFIG = {
  "Sprinter": { capacity: 14, seatsPerRow: 4 },
  "Coach": { capacity: 50, seatsPerRow: 4 },
  "Double Decker": { capacity: 80, seatsPerRow: 5 },
} as const;


const BUS_TYPES = ["Sprinter", "Coach", "Double Decker"] as const;

const busSchema = z.object({
  plateNo: z.string().min(1, "Plate number is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  seatsPerRow: z.coerce.number().int().min(1, "Seats per row must be at least 1"),
  isActive: z.boolean().default(true),
  busType: z.enum(BUS_TYPES),
});

type BusFormValues = z.infer<typeof busSchema>;

interface BusFormProps {
  defaultValues?: BusFormValues;
  onSubmit: (data: BusFormValues) => void;
  isSubmitting?: boolean;
}

const BusForm = ({ defaultValues, onSubmit, isSubmitting = false }: BusFormProps) => {
  const form = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: defaultValues || {
      plateNo: "",
      capacity: 20,
      seatsPerRow: 4,
      isActive: true,
      busType: "Coach",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plateNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plate Number</FormLabel>
              <FormControl>
                <Input placeholder="ABC-123XY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seatsPerRow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seats Per Row</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={6} {...field} />
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
                  Set whether this bus is actively in service or under maintenance
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus Type Date</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => {
                    const selectedType = e.target.value as keyof typeof BUS_TYPE_CONFIG;
                    const config = BUS_TYPE_CONFIG[selectedType];

                    field.onChange(selectedType);
                    form.setValue("capacity", config.capacity);
                    form.setValue("seatsPerRow", config.seatsPerRow);
                  }}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm"
                >
                  {BUS_TYPES.map((type) => (
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Bus"}
        </Button>
      </form>
    </Form>
  );
};

export default BusForm;
