
import React, { useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Check, Mail, MapPin, Calendar, Ticket } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Confirmation = () => {
  const navigate = useNavigate();
  const { 
    departure, 
    destination, 
    date,
    tripType,
    returnDate,
    passengers,
    selectedBus,
    selectedSeats,
    passengerInfo,
    paymentInfo,
    bookingToken,
    resetForm
  } = useBookingStore();


  // Simulate sending a confirmation email
  useEffect(() => {
    // This would be an API call to send the email in a real application
    toast.success("E-Ticket has been sent to your email");
  }, []);
  
  const handleBookAnother = () => {
    // Reset all form data
    resetForm();
    // Navigate to booking page
    navigate("/booking");
  };
  
  const handleGoHome = () => {
    // Reset all form data
    resetForm();
    // Navigate to home page
    navigate("/");
  };

  // Create a "fake" booking reference number
  const bookingRef = `TX${Math.floor(100000 + Math.random() * 900000)}`;

  const totalAmount = selectedBus ? selectedBus.price * passengers : 0;

   const seatNo = selectedSeats[0]?.seatNo;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Thank you for booking with Corpers Drive. Your booking has been confirmed.
        </p>
      </div>

      {/* Booking Reference */}
      <div className="bg-primary/5 p-4 rounded-lg text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
        <p className="text-2xl font-bold">{bookingToken}</p>
      </div>

      {/* Trip Details */}
      <div className="mb-6 border rounded-lg p-4">
        <h3 className="font-semibold flex items-center mb-4">
          <MapPin className="h-5 w-5 mr-2" />
          Trip Details
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">{departure}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departure Date</p>
            <p className="font-medium">
              {date ? format(date, "EEE, MMM d, yyyy") : "N/A"}
            </p>
          </div>
          {tripType === "roundTrip" && returnDate && (
            <div>
              <p className="text-sm text-gray-500">Return Date</p>
              <p className="font-medium">
                {format(returnDate, "EEE, MMM d, yyyy")}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Departure Time</p>
            <p className="font-medium">{selectedBus?.departureTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trip Type</p>
            <p className="font-medium capitalize">
              {tripType === "oneWay" ? "One Way" : "Round Trip"}
            </p>
          </div>
        </div>
      </div>

      {/* Bus & Seat Details */}
      <div className="mb-6 border rounded-lg p-4">
        <h3 className="font-semibold flex items-center mb-4">
          <Ticket className="h-5 w-5 mr-2" />
          Bus & Seat Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Bus</p>
            <p className="font-medium">{selectedBus?.busName}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Bus Type</p>
            <p className="font-medium">{selectedBus?.busType}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Seat Number(s)</p>
            <p className="font-medium">{seatNo}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Passengers</p>
            <p className="font-medium">{passengers}</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mb-8 border rounded-lg p-4">
        <h3 className="font-semibold flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2" />
          Payment Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Payment Method</p>
            <p className="font-medium capitalize">{paymentInfo?.method}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Price per Seat</p>
            <p className="font-medium">₦{selectedBus?.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <p>Total Amount</p>
            <p>₦{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="flex items-center font-medium text-amber-800 mb-2">
          <Mail className="h-5 w-5 mr-2" />
          Important Information
        </h3>
        <ul className="text-sm text-amber-800 space-y-1 list-disc pl-5">
          <li>Your e-ticket has been sent to {passengerInfo?.primaryPassenger?.email}</li>
          <li>Please arrive at the terminal 30 minutes before departure</li>
          <li>Present your booking reference or e-ticket for boarding</li>
          <li>You can manage your booking using your booking reference</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" onClick={handleBookAnother}>
          Book Another Trip
        </Button>
        <Button onClick={handleGoHome}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
