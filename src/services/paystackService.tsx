// ./payment/paymentHelpers.ts
import { toast } from "@/components/ui/sonner";
import api  from "@/services/api"; // adjust path if different
import PaystackPop from '@paystack/inline-js'

export interface PaystackParams {
  email: string;
  amount: number;
  bookingId: number,
  seatIds: number[],
  isSplitPayment?: boolean;
}

// Updated PaymentResult interface
export interface PaymentResult {
  success: boolean;
  ticketUrl?: string;
  cancelled?: boolean;
  seatExpired?: boolean;
  error?: {
    message: string;
    type: 'seat_expired' | 'booking_not_found' | 'payment_failed' | 'cancelled' | 'unknown';
    originalError?: any;
  };
}

export const payWithPaystack = async ({
  email,
  amount,
  bookingId,
  seatIds,
  isSplitPayment,
}: PaystackParams): Promise<PaymentResult> => {
  try {
    const { data } = await api.post(`/payments/initialize`, {
      email,
      amount,
      bookingId,
      seatIds,
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
            
            const verifyRes = await api.post(
              `/payments/verify`, {
                reference: transaction.reference,
                seatIds,
              }
            );

            const ticketUrl = verifyRes.data.ticketUrl;
            console.log("VERIFIED:", verifyRes);
            
            if (transaction.status === "success") {
              toast.success("Payment successful. A confirmation email has been sent.");
              resolveOnce({ success: true, ticketUrl });
            } else {
              toast.error("Payment not marked successful.");
              resolveOnce({ 
                success: false,
                error: {
                  message: "Payment not marked successful",
                  type: 'payment_failed'
                }
              });
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);

            if (verifyError.response) {
              console.error("Error response:", verifyError.response.data);
              console.error("Error status:", verifyError.response.status);
            }
            
            toast.error("Could not verify payment. Contact support.");
            resolveOnce({ 
              success: false,
              error: {
                message: "Could not verify payment. Contact support.",
                type: 'payment_failed',
                originalError: verifyError
              }
            });
          }
        },

        onCancel: () => {
          console.log("Payment was cancelled by user");
          toast.info("Payment was cancelled.");
          resolveOnce({ 
            success: false, 
            cancelled: true,
            error: {
              message: "Payment was cancelled",
              type: 'cancelled'
            }
          });
        }
      });

      // Fallback timeout in case neither onSuccess nor onCancel fires
      setTimeout(() => {
        if (!isResolved) {
          console.log("Payment popup timeout - likely closed without action");
          resolveOnce({ 
            success: false, 
            cancelled: true,
            error: {
              message: "Payment popup timeout",
              type: 'cancelled'
            }
          });
        }
      }, 300000); // 5 minutes timeout
    });
  } catch (error: any) {
    console.error("Payment initialization error:", error?.response?.data || error.message);
    
    const errorMessage = error?.response?.data?.message || error.message;
    
    // Determine error type based on the message
    let errorType: PaymentResult['error']['type'] = 'unknown';
    let seatExpired = false;
    
    if (errorMessage?.includes('Hold expired') || errorMessage?.includes('seat')) {
      errorType = 'seat_expired';
      seatExpired = true;
      // Don't show toast here, let the component handle it
    } else if (errorMessage?.includes('Booking not found')) {
      errorType = 'booking_not_found';
    } else {
      errorType = 'payment_failed';
      // Show generic error toast
      toast.error(errorMessage || "Could not start payment. Please try again.");
    }
    
    return { 
      success: false,
      seatExpired,
      error: {
        message: errorMessage || "Payment initialization failed",
        type: errorType,
        originalError: error
      }
    };
  }
};