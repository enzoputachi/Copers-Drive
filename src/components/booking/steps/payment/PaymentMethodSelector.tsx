import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Split, Wallet } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";

interface PaymentMethodSelectorProps {
  paymentMethod: "full" | "split";
  onPaymentMethodChange: (value: "full" | "split") => void;
}



const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {

  const { paymentType } = useBookingStore();
  console.log("payment selecter:", paymentType);
  

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-4">Select Payment Method</h3>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: "full" | "split") => onPaymentMethodChange(value)}
        className="space-y-4"
      >
        <div
          className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
            paymentMethod === "full" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="full" id="full" />
          <div className="flex-1">
            <label
              htmlFor="full"
              className="flex items-center text-base font-medium cursor-pointer"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Full Payment
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Pay the full amount now
            </p>
          </div>
        </div>

        { paymentType.toLowerCase() === "split" && (
          <div
          className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
            paymentMethod === "split" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="split" id="split" />
          <div className="flex-1">
            <label
              htmlFor="split"
              className="flex items-center text-base font-medium cursor-pointer"
            >
              <Split className="mr-2 h-5 w-5" />
              Split Payment
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Pay a commitment fee now, balance later
            </p>
          </div>
        </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;