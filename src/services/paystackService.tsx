// ./payment/paymentHelpers.ts
import { toast } from "@/components/ui/sonner";
import api  from "@/services/api"; // adjust path if different
import PaystackPop from '@paystack/inline-js'

export interface PaystackParams {
  email: string;
  amount: number;
  bookingId: number  
}

export const payWithPaystack = async ({
  email,
  amount,
  bookingId,
}: PaystackParams): Promise<{ success: boolean; ticketUrl?: string }> => {
  try {
    const { data } = await api.post(`/payments/initialize`, {
      email,
      amount,
      bookingId
    });

    const { paystackRef } = data.data;
    console.log("Refrence:", paystackRef);
  

    const paystack = new PaystackPop();

    return new Promise((resolve) => {
      paystack.newTransaction({
        key: "pk_test_73e068069c3d3111592867a42c07d8009aafe82f",
        email,
        amount,
        reference: paystackRef,

        onSuccess: async (transaction: any) => {
          try {
            const verifyRes = await api.get(
              `/payments/verify/${transaction.reference}`
            );

            const ticketUrl = verifyRes.data.ticketUrl;

            console.log("VERIFES:", verifyRes);
            

            if (transaction.status === "success") {
              toast.success("Payment successful. A confirmation email has been sent.");
              resolve({ success: true, ticketUrl });
            } else {
              toast.error("Payment not marked successful.");
              resolve({ success: false });
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            toast.error("Could not verify payment. Contact support.");
            resolve({ success: false });
          }
        },

        onCancel: () => {
          toast.info("Payment was cancelled.");
          resolve({ success: false });
        },
      });
    });
  } catch (error: any) {
    console.error("Initialization error:", error?.response?.data || error.message);
    toast.error(
      error?.response?.data?.message ||
        "Could not start payment. Please try again."
    );
    return { success: false };
  }
};
