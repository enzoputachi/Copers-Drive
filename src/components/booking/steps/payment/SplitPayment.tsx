
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface SplitPaymentProps {
  totalAmount: number;
  commitmentAmount: number;
}

const SplitPayment: React.FC<SplitPaymentProps> = ({ 
  totalAmount, 
  commitmentAmount 
}) => {
  const remainingAmount = totalAmount - commitmentAmount;

  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Split Payment Option:</strong> Pay a commitment fee of ₦{commitmentAmount.toLocaleString()} now 
          to secure your booking. The remaining balance of ₦{remainingAmount.toLocaleString()} can be paid later.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium">Payment Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-medium">₦{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-primary">
            <span>Commitment Fee (Now):</span>
            <span className="font-medium">₦{commitmentAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Remaining Balance (Later):</span>
            <span className="font-medium">₦{remainingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>How it works:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Pay the commitment fee of ₦{commitmentAmount.toLocaleString()} to secure your seat</li>
          <li>You'll receive a booking confirmation with payment instructions</li>
          <li>Complete the remaining payment before your travel date</li>
          <li>Your seat remains reserved during the payment period</li>
        </ul>
      </div>
    </div>
  );
};

export default SplitPayment;