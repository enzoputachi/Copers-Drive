import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Check, Mail, MapPin, Calendar, Ticket, MessageCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useGetBookingByToken, useSettings } from "@/hooks/useApi";

const Confirmation = () => {
  const navigate = useNavigate();
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const { data, isLoading, error } = useSettings()
  const bookingMutation = useGetBookingByToken();
  const settings = data?.data?.data;

  console.log('Booking mutation:', bookingMutation.data)

  const { 
    bookingToken,
    resetForm
  } = useBookingStore();

  useEffect(() => {
    if (bookingToken) {
      bookingMutation.mutate({ bookingToken });
    }
  }, [bookingToken]);

  // Simulate sending a confirmation email
  useEffect(() => {
    // This would be an API call to send the email in a real application
    toast.success("E-Ticket has been sent to your email");
  }, []);

  useEffect(() => {
    if (!bookingToken) return;

    const shownToken = sessionStorage.getItem("shownWhatsAppBookingToken");

    if (shownToken !== bookingToken) {
      const timer = setTimeout(() => {
        setShowWhatsAppDialog(true);
        sessionStorage.setItem("shownWhatsAppBookingToken", bookingToken);
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, [bookingToken]);

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

  const handleJoinWhatsApp = () => {
    // Replace with your actual WhatsApp group link
    const whatsAppUrl = settings?.whatsAppGroupUrl;
    const whatsappGroupLink = whatsAppUrl || '#';
    window.open(whatsappGroupLink, "_blank");
  };

  // Get booking data from API
  const apiResponse = bookingMutation.data;
  const bookingData = apiResponse?.booking;
  const isLoadingBooking = bookingMutation.isPending;
  const bookingError = bookingMutation.error;

  if (isLoadingBooking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (bookingError || !bookingData) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">
          Booking Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          {bookingError?.message ||
            "Unable to retrieve your booking details."}
        </p>
        <Button onClick={() => {
          resetForm();
          navigate("/");
        }}>Return to Home</Button>
      </div>
    );
  }

  // Extract data from API response
  const trip = bookingData.trip;
  const route = trip?.route;
  const bus = trip?.bus;
  const seatNo = bookingData.seat.map((s) => s.seatNo)
  const payment = bookingData.payment?.[0]; // payment is an array
  
  // Calculate payment amounts
  const paidAmountInKobo = payment.amount || 0;
  const paidAmountInNaira = paidAmountInKobo / 100;
  const totalAmount = trip?.price || 0;
  const isSplitPayment = bookingData.amountDue > 0;

  // Parse dates
  const departureDate = trip?.departTime ? new Date(trip.departTime) : null;
  const returnDate = null; // No return date in current structure

  return (
    <div>
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Thank you for booking with Corpers Drive. Your booking has been sent
          to your email.
        </p>
      </div>

      {/* Booking Reference */}
      <div className="bg-primary/5 p-4 rounded-lg text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
        <p className="text-2xl font-bold">{bookingData.bookingToken}</p>
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
            <p className="font-medium">{route?.origin || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{route?.destination || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departure Date</p>
            <p className="font-medium">
              {departureDate ? format(departureDate, "EEE, MMM d, yyyy") : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departure Time</p>
            <p className="font-medium">
              {departureDate ? format(departureDate, "HH:mm") : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trip Type</p>
            <p className="font-medium capitalize">One Way</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{bookingData.status || 'N/A'}</p>
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
            <p className="font-medium">{bus?.busType || 'N/A'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Bus Capacity</p>
            <p className="font-medium">{bus?.capacity || 'N/A'} seats</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Seat Number</p>
            <p className="font-medium">{seatNo || 'N/A'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Passenger Name</p>
            <p className="font-medium">{bookingData.passengerName || 'N/A'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Passenger Phone</p>
            <p className="font-medium">{bookingData.mobile || 'N/A'}</p>
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
            <p className="font-medium capitalize">{payment?.channel || 'N/A'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Payment Status</p>
            <p className="font-medium capitalize">
              {bookingData.isPaymentComplete ? 'Complete' : 'Partial'}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Price per Seat</p>
            <p className="font-medium">
              ₦{totalAmount?.toLocaleString() || '0'}
            </p>
          </div>
          {isSplitPayment ? (
            <>
              <div className="flex justify-between">
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-medium">
                  ₦{paidAmountInNaira.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Balance Remaining</p>
                <p className="font-medium">
                  ₦{(bookingData.amountDue / 100).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <p>Total Amount</p>
                <p>₦{totalAmount?.toLocaleString() || '0'}</p>
              </div>
            </>
          ) : (
            <div className="flex justify-between font-semibold pt-2 border-t">
              <p>Total Amount Paid</p>
              <p>₦{paidAmountInNaira.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="flex items-center font-medium text-amber-800 mb-2">
          <Mail className="h-5 w-5 mr-2" />
          Important Information
        </h3>
        <ul className="text-sm text-amber-800 space-y-1 list-disc pl-5">
          <li>
            Your e-ticket has been sent to {bookingData.email || 'your email'}
          </li>
          <li>Please arrive at the terminal 30 minutes before departure</li>
          <li>Present your booking reference or e-ticket for boarding</li>
          <li>You can manage your booking using your booking reference</li>
          {isSplitPayment && (
            <li className="font-medium">
              Balance payment of ₦{(bookingData.amountDue / 100).toLocaleString()} 
              is required before travel
            </li>
          )}
          <li>Passenger: {bookingData.passengerName} - {bookingData.mobile}</li>
        </ul>
      </div>
        
      {/* WhatsApp Community */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="flex items-center font-medium text-green-800 mb-2">
          <MessageCircle className="h-5 w-5 mr-2" />
          Join Our Community
        </h3>
        <p className="text-sm text-green-800 mb-3">
          Get updates, connect with other travelers, and access exclusive offers
          by joining our WhatsApp community.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWhatsAppDialog(true)}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Join WhatsApp Community
        </Button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" onClick={handleBookAnother}>
          Book Another Trip
        </Button>
        <Button onClick={handleGoHome}>Return to Home</Button>
      </div>

      {/* WhatsApp Community Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Join Our Travel Community
            </DialogTitle>
            <DialogDescription>
              Connect with other travelers and get exclusive updates!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                🚌 Get real-time travel updates<br/>
                💬 Connect with fellow travelers<br/>
                🎁 Access exclusive offers & discounts<br/>
                📍 Receive important route information
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  handleJoinWhatsApp();
                  setShowWhatsAppDialog(false);
                }}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join WhatsApp Community
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Confirmation;