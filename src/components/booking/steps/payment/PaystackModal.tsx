
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface PaystackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaystackModal: React.FC<PaystackModalProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <svg className="w-20 h-20 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7.5 4.5-7.5 4.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center mb-4">Paystack Payment</h3>
          <p className="text-gray-500 mb-6 text-center">
            Please wait while we process your payment...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PaystackModal;
