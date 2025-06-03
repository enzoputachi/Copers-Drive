
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: "card" | "transfer" | "wallet";
  onPaymentMethodChange: (value: "card" | "transfer" | "wallet") => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-4">Select Payment Method</h3>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: "card" | "transfer" | "wallet") => onPaymentMethodChange(value)}
        className="space-y-4"
      >
        <div
          className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
            paymentMethod === "card" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="card" id="card" />
          <div className="flex-1">
            <label
              htmlFor="card"
              className="flex items-center text-base font-medium cursor-pointer"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Credit/Debit Card
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Pay with Visa, Mastercard, or other card via Paystack
            </p>
          </div>
        </div>

        <div
          className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
            paymentMethod === "transfer" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="transfer" id="transfer" />
          <div className="flex-1">
            <label
              htmlFor="transfer"
              className="flex items-center text-base font-medium cursor-pointer"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Bank Transfer
            </label>
            <p className="text-gray-500 text-sm mt-1">Pay via bank transfer</p>
          </div>
        </div>

        <div
          className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
            paymentMethod === "wallet" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="wallet" id="wallet" />
          <div className="flex-1">
            <label
              htmlFor="wallet"
              className="flex items-center text-base font-medium cursor-pointer"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Copers Drive Wallet
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Pay using your Copers Drive wallet balance
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
