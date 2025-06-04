
import { z } from "zod";

// Card payment schema
export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number cannot exceed 19 digits")
    .refine(val => /^[0-9\s-]+$/.test(val), "Card number must contain only digits"),
  cardName: z.string().min(3, "Card holder name is required"),
  expiryMonth: z.string().min(1, "Month is required"),
  expiryYear: z.string().min(1, "Year is required"),
  cvv: z.string().min(3, "CVV must be 3 or 4 digits").max(4, "CVV must be 3 or 4 digits"),
});

// Bank transfer schema
export const bankTransferSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  accountName: z.string().min(3, "Account name is required"),
});

// Paystack 
export const simplePaymentSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  amount: z.number().min(100, "Amount must be at least ₦100"),
});


// Empty schema for wallet payments
export const walletSchema = z.object({});

// Type for the form data based on payment method
export type CardFormData = z.infer<typeof cardPaymentSchema>;
export type BankTransferFormData = z.infer<typeof bankTransferSchema>;
export type WalletFormData = z.infer<typeof walletSchema>;
export type SimplePaymentFormData = z.infer<typeof simplePaymentSchema>;

// Payment information types
export interface PaymentInfo {
  method: "card" | "transfer" | "wallet";
  amount: number;
  cardDetails?: CardFormData;
  transferDetails?: BankTransferFormData;
}

// Union type for all form data
export type PaymentFormData = CardFormData | BankTransferFormData | WalletFormData;
