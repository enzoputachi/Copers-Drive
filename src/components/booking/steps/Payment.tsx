import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
// import { bookingsApi } from "@/services/api";
import OrderSummary from "./payment/OrderSummary";
import SimplePaymentForm from "./payment/SimplePaymentForm";
import {
  simplePaymentSchema,
  SimplePaymentFormData,
} from "./payment/paymentTypes";
import { usePaystackPayment } from "@/hooks/useApi";
// import { processPaystackPayment } from "@/services/paystackService";
import SplitPayment from './payment/SplitPayment';
import PaymentMethodSelector from './payment/PaymentMethodSelector';
import TermsModal from '../../TermsModal';

interface PaymentProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

const Payment = ({ onComplete, setStepComplete }: PaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"full" | "split">("full");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false); 
  
  const {
    selectedBus,
    passengers,
    selectedSeats,
    paymentInfo,
    setPaymentInfo,
    bookingDraftId,
    bookingToken,
    paymentType,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount based on selected bus and passengers
  const totalAmount = selectedBus ? selectedBus.price * passengers : 0;
  const commitmentFee = 5000; 

  const amountToPayInKobo = paymentMethod === "split" ? (Math.round(commitmentFee * 100)) : (Math.round(totalAmount * 100))

  const form = useForm<SimplePaymentFormData>({
    resolver: zodResolver(simplePaymentSchema),
    defaultValues: {
      email: paymentInfo?.email || "",
      amount: amountToPayInKobo,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.setValue("amount", amountToPayInKobo);
  }, [amountToPayInKobo, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      const { isValid } = form.formState;
      // Only mark step as complete if form is valid AND terms are agreed to
      const shouldBeComplete = isValid && hasAgreedToTerms && paymentSuccessful;
      setStepComplete("payment", shouldBeComplete);
    });

    console.log('Payment DET:', paymentInfo);

    return () => subscription.unsubscribe();
  }, [form, setStepComplete, paymentInfo, hasAgreedToTerms, paymentSuccessful]);

  const { mutateAsync, isPending } = usePaystackPayment()

  // Handle terms agreement
  const handleAgreeToTerms = () => {
    setHasAgreedToTerms(true);
    setIsTermsModalOpen(false);
    toast.success("Terms and conditions accepted");
  };

  // Handle terms checkbox change - checkbox works normally
  const handleTermsCheckboxChange = (checked: boolean) => {
    setHasAgreedToTerms(checked);
  };

  // Handle modal close
  const handleTermsModalClose = () => {
    setIsTermsModalOpen(false);
  };

  // Call Paystack on submit
  const onSubmit = async (values: SimplePaymentFormData) => {
    console.log("SUbmit cliked")
    if (!hasAgreedToTerms) {
      toast.error("Please agree to the terms and conditions to proceed");
      return;
    }

    if (!bookingDraftId) {
      toast.error("No booking draft found. Please start over.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStepComplete("payment", false);

      // Persist payment in zustand
      setPaymentInfo({
        method: "paystack",
        amount: amountToPayInKobo,
        email: values.email,
      });

      await mutateAsync({
        email: values.email,
        amount: amountToPayInKobo,
        bookingId: bookingDraftId,
        seatIds: selectedSeats.map((seat) => seat.seatId),
        isSplitPayment: paymentMethod === "split",
      });

      // If we reach here, payment was successful (no error thrown)
      toast.success("Payment successful and booking created!");
      setStepComplete("payment", true);
      onComplete();
    } catch (error: any) {
      // console.error("Payment error:", error);
      setStepComplete("payment", false);
      // const errorMessage = error?.response?.data?.message || error.message || '';
      
      // if (errorMessage.includes('Hold expired') || errorMessage.includes('seat')) {
      //     toast.error("Your seat reservation has expired. Redirecting to seat selection...", {
      //       duration: 5000
      //     })
      // }
    
      // toast.error(error.message); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePaymentMethodchange = (value: "full" | "split") => {
    setPaymentMethod(value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      <OrderSummary
        selectedBus={selectedBus}
        selectedSeats={selectedSeats.map((seat) => seat.seatNo)}
        passengers={passengers}
        totalAmount={totalAmount}
      />
      
      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onPaymentMethodChange={handlePaymentMethodchange}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {paymentMethod === "split" ? (
            <SplitPayment
              totalAmount={totalAmount}
              commitmentAmount={commitmentFee}
            />
          ) : null}
          
          <SimplePaymentForm form={form} amount={amountToPayInKobo / 100} />

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="terms"
              checked={hasAgreedToTerms}
              onCheckedChange={handleTermsCheckboxChange}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-primary underline hover:no-underline"
                >
                  Terms and Conditions
                </button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Please read and accept our terms before proceeding with payment
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || selectedSeats.length === 0 || !hasAgreedToTerms || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Processing Payment..."
              : `Pay ₦${(amountToPayInKobo / 100).toLocaleString()}`}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Payment is secured and protected
          </p>
        </form>
      </Form>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={handleTermsModalClose}
        onAgree={handleAgreeToTerms}
      />
    </div>
  );
};

export default Payment;