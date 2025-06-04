
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CardFormData } from "./paymentTypes";

// Create months and years for expiry date
const months = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
});

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => {
  const year = currentYear + i;
  return { value: year.toString(), label: year.toString() };
});

interface CardPaymentFormProps {
  form: UseFormReturn<any>;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input 
                placeholder="1234 5678 9012 3456" 
                {...field} 
                onChange={(e) => {
                  // Format card number with spaces for better readability
                  let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                  if (value) {
                    value = value.match(/.{1,4}/g)?.join(' ') || value;
                  }
                  field.onChange(value);
                }}
                maxLength={19}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cardName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Holder Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="expiryMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
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
          name="expiryYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
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
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="123" 
                  maxLength={4}
                  {...field}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CardPaymentForm;
