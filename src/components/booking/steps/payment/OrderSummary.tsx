
import React from "react";

interface OrderSummaryProps {
  selectedBus: {
    busType: string;
    price: number;
  } | null;
  selectedSeats: string[];
  passengers: number;
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  selectedBus, 
  selectedSeats, 
  passengers, 
  totalAmount 
}) => {
  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-3">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Bus Type:</span>
          <span className="font-medium">{selectedBus?.busType || "Not selected"}</span>
        </div>
        <div className="flex justify-between">
          <span>Seat{selectedSeats.length > 1 ? 's' : ''}:</span>
          <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Not selected"}</span>
        </div>
        <div className="flex justify-between">
          <span>Passengers:</span>
          <span className="font-medium">{passengers}</span>
        </div>
        <div className="flex justify-between">
          <span>Price per seat:</span>
          <span className="font-medium">₦{selectedBus?.price.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t font-semibold">
          <span>Total Amount:</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
