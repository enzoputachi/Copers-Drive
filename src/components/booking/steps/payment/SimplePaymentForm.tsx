import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SimplePaymentFormProps {
  form: UseFormReturn<any>;
  amount: number; // Amount in Naira (₦)
}

const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({ form, amount }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="jane@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount (₦)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1000"
                value={amount}
                readOnly
                tabIndex={-1} // Prevents focus
                onChange={(e) => {
                  // Convert to kobo if needed when sending to Paystack
                  const value = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SimplePaymentForm;
