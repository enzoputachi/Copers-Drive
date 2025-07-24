import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";
import { useSettings, useRetrieveBooking } from "@/hooks/useApi";

const ManageBooking = () => {
  const { toast } = useToast();
  const { data, error } = useSettings();
  const [bookingToken, setBookingToken] = useState("");
  const [email, setEmail] = useState("");
  const settings = data?.data?.data;

  const { mutate: retrieveBooking, isPending } = useRetrieveBooking();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Booking retrieval initiated",
      description: "We're searching for your booking. Please wait...",
    });
    retrieveBooking(
      { bookingToken, email },
      {
        onSuccess: (booking) => {
          toast({
            title: "Booking found!",
            description: `Booking retrieved successfully. Details sents to your email`,
          });
          // Redirect or show booking details;
        },
        onError: (error) => {
          toast({
            title: "No booking found",
            description:
            "We couldn't find a booking with the provided details. Please check and try again.",
            variant: "destructive",
          })
        }
      }
    )
  };

  return (
    <>
      <Helmet>
        <title>Manage Your Booking | Corpers Drive</title>
        <meta name="description" content="Retrieve, modify or cancel your existing Corpers Drive bookings." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-100 container mx-auto px-2 py-4 sm:px-4 sm:py-8 min-h-screen">
        <div className="max-w-full sm:max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Your Booking</h1>
          
          <Card className="mb-4 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Retrieve Your Booking</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your booking reference number and the email address used during booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="bookingReference" className="block text-sm font-medium mb-1">
                    Booking Reference
                  </label>
                  <Input
                    id="bookingReference"
                    value={bookingToken}
                    onChange={(e) => setBookingToken(e.target.value)}
                    placeholder="e.g. TX12345"
                    required
                    className="w-full h-10 sm:h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full h-10 sm:h-12"
                  />
                </div>
                
                <Button type="submit" className="w-full h-10 sm:h-12" disabled={isPending}>
                  {isPending ? "Searching..." : "Retrieve Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Need Help?</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              If you're having trouble finding your booking, please contact our customer support team:
            </p>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-sm sm:text-base">
                <span className="font-medium">Phone:</span> {settings?.contactPhone || "coming soon"}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-medium">Email:</span> {settings?.contactEmail || "coming soon"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default ManageBooking;
