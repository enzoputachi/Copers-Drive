// ./payment/paymentHelpers.ts
import { toast } from "@/components/ui/sonner";
import api  from "@/services/api"; // adjust path if different
import PaystackPop from '@paystack/inline-js'

export interface PaystackParams {
  email: string;
  amount: number;
  bookingId: number,
  isSplitPayment?: boolean;
}

export interface PaymentResult {
  success: boolean;
  ticketUrl?: string;
  cancelled?: boolean;
}

export const payWithPaystack = async ({
  email,
  amount,
  bookingId,
  isSplitPayment,
}: PaystackParams): Promise<PaymentResult> => {
  try {
    const { data } = await api.post(`/payments/initialize`, {
      email,
      amount,
      bookingId,
      isSplitPayment,
    });

    const { paystackRef } = data.data;
    console.log("Reference:", paystackRef);
  
    const paystack = new PaystackPop();

    return new Promise((resolve) => {
      let isResolved = false;

      const resolveOnce = (result: PaymentResult) => {
        if (!isResolved) {
          isResolved = true;
          resolve(result);
        }
      };

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_LIVE_PUBLIC_KEY,
        email,
        amount,
        reference: paystackRef,

        onSuccess: async (transaction: any) => {
          try {
            console.log("Payment transaction completed:", transaction);
            
            const verifyRes = await api.get(
              `/payments/verify/${transaction.reference}`
            );

            const ticketUrl = verifyRes.data.ticketUrl;
            console.log("VERIFIED:", verifyRes);
            
            if (transaction.status === "success") {
              toast.success("Payment successful. A confirmation email has been sent.");
              resolveOnce({ success: true, ticketUrl });
            } else {
              toast.error("Payment not marked successful.");
              resolveOnce({ success: false });
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            toast.error("Could not verify payment. Contact support.");
            resolveOnce({ success: false });
          }
        },

        onCancel: () => {
          console.log("Payment was cancelled by user");
          toast.info("Payment was cancelled.");
          resolveOnce({ success: false, cancelled: true });
        }
      });

      // Fallback timeout in case neither onSuccess nor onCancel fires
      // This can happen if user closes the popup without explicitly cancelling
      setTimeout(() => {
        if (!isResolved) {
          console.log("Payment popup timeout - likely closed without action");
          resolveOnce({ success: false, cancelled: true });
        }
      }, 300000); // 5 minutes timeout
    });
  } catch (error: any) {
    console.error("Payment initialization error:", error?.response?.data || error.message);
    toast.error(
      error?.response?.data?.message ||
        "Could not start payment. Please try again."
    );
    return { success: false };
  }
};