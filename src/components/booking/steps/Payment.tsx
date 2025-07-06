import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

interface PaymentProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}


const Payment = ({ onComplete, setStepComplete }: PaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"full" | "split">("full");
  const {
    selectedBus,
    passengers,
    selectedSeats,
    paymentInfo,
    setPaymentInfo,
    bookingDraftId,
    bookingToken,
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
      setStepComplete("payment", isValid);
    });

    console.log('Payment DET:', paymentInfo);
  

    return () => subscription.unsubscribe();
  }, [form, setStepComplete, paymentInfo]);

  const { mutateAsync, isPending } = usePaystackPayment()

  // Call Paystack on submit
  const onSubmit = async (values: SimplePaymentFormData) => {
    if (!bookingDraftId) {
      toast.error("No booking draft found. Please start over.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Persist payment in zustand
      setPaymentInfo({
        method: "paystack",
        amount: amountToPayInKobo,
        email: values.email,
      });

      // // Paystack launches
      // const paymentSuccessful = await processPaystackPayment(
      //   values.email,
      //   totalAmount
      // );


      const paymentSuccessful = await mutateAsync({
        email: values.email,
        amount: amountToPayInKobo,
        bookingId: bookingDraftId,
        isSplitPayment: paymentMethod === "split",
      })

      if (!paymentSuccessful) {
        setIsSubmitting(false);
        return;
      }


      toast.success("Payment successful and booking created!");
      onComplete();
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
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
          

          <Button
            type="submit"
            disabled={isPending || selectedSeats.length === 0}
            className="w-full"
          >
            {isSubmitting
              ? "Processing Payment..."
              : `Pay ₦${(amountToPayInKobo / 100).toLocaleString()}`}
          </Button>

          <p className="text-center text-sm text-gray-500">
            By proceeding, you agree to our terms and privacy policy.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Payment;
