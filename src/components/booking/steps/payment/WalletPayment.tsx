
import React from "react";

interface WalletPaymentProps {
  amount: number;
}

const WalletPayment: React.FC<WalletPaymentProps> = ({ amount }) => {
  return (
    <div className="bg-primary/5 p-4 rounded-lg">
      <p className="mb-2">Your Corpers Drive Wallet Balance:</p>
      <p className="text-2xl font-bold">₦120,000.00</p>
      <p className="text-sm text-gray-500 mt-2">
        The amount of ₦{amount.toLocaleString()} will be deducted from your wallet balance.
      </p>
    </div>
  );
};

export default WalletPayment;
