
import Navbar from "@/components/Navbar";
import BookingWizard from "@/components/booking/BookingWizard";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/stores/bookingStore";
import { Helmet } from "react-helmet-async";

const Booking = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Helmet>
        <title>Book Your Trip | Copers Drive</title>
        <meta name="description" content="Book your NYSC trip with Copers Drive - Safe and reliable transportation for corps members" />
      </Helmet>
      <Navbar />
      <BookingProvider>
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Book Your Trip</h1>
            <BookingWizard />
          </div>
        </main>
      </BookingProvider>
      <Footer />
    </div>
  );
};

export default Booking;
