
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

// List of banks for bank transfer option
const banks = [
  "Access Bank",
  "First Bank",
  "Guaranty Trust Bank",
  "United Bank for Africa",
  "Zenith Bank",
  "Polaris Bank",
  "Fidelity Bank",
  "Ecobank",
  "Union Bank",
  "Sterling Bank"
];

interface BankTransferFormProps {
  form: UseFormReturn<any>;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
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
        name="accountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input 
                placeholder="0123456789" 
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

      <FormField
        control={form.control}
        name="accountName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BankTransferForm;
