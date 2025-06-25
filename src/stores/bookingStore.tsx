
import { createContext, useContext, ReactNode } from "react";
import { create } from "zustand";
import { boolean } from 'zod';
import { persist } from "zustand/middleware";

// Types
type SeatClass = "Standard" | "Executive" | "VIP";
type TripType = "oneWay" | "roundTrip";

export type Path<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${Path<T[K]>}`
    : never;
}[keyof T];


export type SelectedSeat = {
  seatId: number;
  seatNo: string;
};

interface Bus {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  availableSeats: number;
  busName: string;
  amenities: string[];
}

interface PassengerDetails {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
}

interface PaymentInfo {
  method: "paystack" | "splitPayment";
  isSplitPayment?: boolean; // Optional, only for split payment
  commitmentAmount?: number; // Optional, only for split payment
  remainingAmount?: number; // Optional, only for split payment
  amount: number;
  email: string;
  reference?: string;
  callbackUrl?: string;
}

export interface PassengerInfoType {
  // primaryPassenger: PassengerDetails;
  [key: string]: PassengerDetails;
}

type BookingState = {

  bookingDraftId?: number;
  bookingToken?: string;

  // Trip basics
  departure: string;
  destination: string;
  date: Date | null;
  returnDate: Date | null;
  passengers: number;
  seatClass: SeatClass;
  tripType: TripType;
  
  // Selected bus and seats
  selectedBus: Bus | null;
  selectedSeats: SelectedSeat[];
  
  // Passenger and payment info
  passengerInfo: PassengerInfoType | null;
  paymentInfo: PaymentInfo | null;

  // New: Track pasenger data submission
  hasSubmittedPassengerData: boolean;

  // Current step in the booking process
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Actions
  setBookingDraftId: (id: number) => void;
  setBookingToken: (bookingToken: string) => void;

  setDeparture: (departure: string) => void;
  setDestination: (destination: string) => void;
  setDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setPassengers: (passengers: number) => void;
  setSeatClass: (seatClass: SeatClass) => void;
  setTripType: (tripType: TripType) => void;
  setSelectedBus: (bus: Bus) => void;
  setSelectedSeats: (seats: SelectedSeat[]) => void;
  setPassengerInfo: (info: PassengerInfoType) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  setSubmittedPassengerData: (hasSubmitted: boolean) => void;
  resetForm: () => void;
};


// ...types...

const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      bookingDraftId: undefined,
      bookingToken: "",
      departure: "",
      destination: "",
      date: null,
      returnDate: null,
      passengers: 1,
      seatClass: "Standard",
      tripType: "oneWay",
      selectedBus: null,
      selectedSeats: [],
      passengerInfo: null,
      paymentInfo: null,
      hasSubmittedPassengerData: false,

      // Current step in the booking process
      currentStep: 0,
      setCurrentStep: (step: number) => set({ currentStep: step }),

      // Actions
      setBookingDraftId: (id: number) => set({ bookingDraftId: id }),
      setBookingToken: (bookingToken: string) => set({ bookingToken: bookingToken }),
      setDeparture: (departure: string) => set({ departure }),
      setDestination: (destination: string) => set({ destination }),
      setDate: (date: Date | null) => set({ date }),
      setReturnDate: (date: Date | null) => set({ returnDate: date }),
      setPassengers: (passengers: number) => set({ passengers }),
      setSeatClass: (seatClass: SeatClass) => set({ seatClass }),
      setTripType: (tripType: TripType) => set({ tripType }),
      setSelectedBus: (bus: Bus) => set({ selectedBus: bus }),
      setSelectedSeats: (seats: SelectedSeat[]) => set({ selectedSeats: seats }),
      setPassengerInfo: (info: PassengerInfoType) => set({ passengerInfo: info }),
      setPaymentInfo: (info: PaymentInfo) => set({ paymentInfo: info }),
      setSubmittedPassengerData: (hasSubmitted: boolean) => set({ hasSubmittedPassengerData: hasSubmitted }),
      resetForm: () => set({
        departure: "",
        destination: "",
        date: null,
        returnDate: null,
        passengers: 1,
        seatClass: "Standard",
        tripType: "oneWay",
        selectedBus: null,
        selectedSeats: [],
        passengerInfo: null,
        paymentInfo: null,
        hasSubmittedPassengerData: false,
        currentStep: 0, // Reset step as well
      }),
    }),
    {
      name: "booking-storage",      
      // partialize: (state) => ({ currentStep: state.currentStep }),
    }
  )
);

// Context for components that can't use Zustand directly
const BookingContext = createContext<ReturnType<typeof useBookingStore> | null>(null);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  // This subscribes to the store and will re-render when the store updates
  const store = useBookingStore();
  
  return (
    <BookingContext.Provider value={store}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export { useBookingStore };
