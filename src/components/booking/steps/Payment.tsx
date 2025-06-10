import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { bookingsApi } from "@/services/api";
import OrderSummary from "./payment/OrderSummary";
import SimplePaymentForm from "./payment/SimplePaymentForm";
import {
  simplePaymentSchema,
  SimplePaymentFormData,
} from "./payment/paymentTypes";
import { processPaystackPayment } from "./payment/paymentHelpers";

interface PaymentProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

const Payment = ({ onComplete, setStepComplete }: PaymentProps) => {
  const {
    selectedBus,
    passengers,
    selectedSeats,
    paymentInfo,
    setPaymentInfo,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = selectedBus ? selectedBus.price * passengers : 0;

  const form = useForm<SimplePaymentFormData>({
    resolver: zodResolver(simplePaymentSchema),
    defaultValues: {
      email: paymentInfo?.email || "",
      amount: totalAmount,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.setValue("amount", totalAmount);
  }, [totalAmount, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      const { isValid } = form.formState;
      setStepComplete("payment", isValid);
    });

    console.log('Payment DET:', paymentInfo);
  

    return () => subscription.unsubscribe();
  }, [form, setStepComplete, paymentInfo]);

  const onSubmit = async (values: SimplePaymentFormData) => {
    if (selectedSeats.length === 0) {
      toast.error("Please select seats before proceeding to payment");
      return;
    }

    try {
      setIsSubmitting(true);

      setPaymentInfo({
        method: "paystack",
        amount: totalAmount,
        email: values.email,
      });

      const paymentSuccessful = await processPaystackPayment(
        values.email,
        totalAmount
      );

      if (!paymentSuccessful) {
        setIsSubmitting(false);
        return;
      }

      await bookingsApi.createBookingDraft({
        amount: totalAmount,
        email: values.email,
      });

      toast.success("Payment successful and booking created!");
      onComplete();
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SimplePaymentForm form={form} />

          <Button
            type="submit"
            disabled={isSubmitting || selectedSeats.length === 0}
            className="w-full"
          >
            {isSubmitting
              ? "Processing Payment..."
              : `Pay ₦${totalAmount.toLocaleString()}`}
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
