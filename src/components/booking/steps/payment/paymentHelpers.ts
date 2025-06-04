
import { toast } from "@/components/ui/sonner";
import { CardFormData, BankTransferFormData } from "./paymentTypes";

// Simulate Paystack payment processing
export const processPaystackPayment = async (email: string, amount: number): Promise<boolean> => {
  try {
    // In a real implementation, this would be an API call to initialize Paystack payment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful payment
    toast.success("Payment successful!");
    
    return true;
  } catch (error) {
    toast.error("Payment failed: " + (error.message || "Please try again"));
    return false;
  }
};

// Get type-safe default values based on payment method
export const getCardDefaultValues = (paymentInfo: Partial<{ cardDetails: Partial<CardFormData> }>): CardFormData => {
  return {
    cardNumber: paymentInfo?.cardDetails?.cardNumber || "",
    cardName: paymentInfo?.cardDetails?.cardName || "",
    expiryMonth: paymentInfo?.cardDetails?.expiryMonth || "",
    expiryYear: paymentInfo?.cardDetails?.expiryYear || "",
    cvv: paymentInfo?.cardDetails?.cvv || "",
  };
};

export const getBankTransferDefaultValues = (paymentInfo: Partial<{ transferDetails: Partial<BankTransferFormData> }>): BankTransferFormData => {
  return {
    bankName: paymentInfo?.transferDetails?.bankName || "",
    accountNumber: paymentInfo?.transferDetails?.accountNumber || "",
    accountName: paymentInfo?.transferDetails?.accountName || "",
  };
};


// export const processPaystackPayment = (
//   email: string,
//   amount: number
// ): Promise<boolean> => {
//   return new Promise((resolve) => {
//     const handler = window.PaystackPop.setup({
//       key: "YOUR_PUBLIC_KEY",
//       email,
//       amount: amount * 100, // Paystack expects amount in kobo
//       callback: function (response: any) {
//         console.log("Payment successful:", response);
//         resolve(true);
//       },
//       onClose: function () {
//         console.log("Payment window closed");
//         resolve(false);
//       },
//     });

//     handler.openIframe();
//   });
// };

