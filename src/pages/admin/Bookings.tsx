import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { useBookings, useUpdateBooking, useRetrieveBooking } from "@/hooks/useAdminQueries";
import { Edit, Save, X, Check, Plus, Ticket } from "lucide-react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/admin/forms/BookingForm"

// Define the edit form interface
interface EditForm {
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  amountPaid: number;
  amountDue: number;
  isPaymentComplete: boolean;
  isSplitPayment: boolean;
}

// —————————————————————————————————————————————
// 1) Mock bookings data (IDs as strings) - Updated with more comprehensive data
// —————————————————————————————————————————————
const initialBookings = [
  {
    id: "1",
    bookingToken: "TX-2023-05-10",
    trip: {
      route: {
        origin: "Lagos",
        destination: "Abuja"
      },
      bus: {
        plateNo: "ABC-123XY",
        busType: "Sprinter",
        capacity: 14
      },
      departTime: "2023-05-15T08:00:00Z",
      arriveTime: "2023-05-15T14:00:00Z",
      price: 8500
    },
    seat: [{ seatNo: "5A" }],
    passengerTitle: "Mr",
    passengerName: "John Doe",
    passengerAddress: "123 Victoria Island, Lagos",
    passengerAge: 28,
    nextOfKinName: "Jane Doe",
    nextOfKinPhone: "+2348012345678",
    email: "john.doe@email.com",
    mobile: "+2348087654321",
    status: "CONFIRMED",
    createdAt: "2023-05-10T09:30:00Z",
    updatedAt: "2023-05-10T10:00:00Z",
    isSplitPayment: false,
    amountPaid: 8500,
    amountDue: 0,
    isPaymentComplete: true,
  },
  {
    id: "2",
    bookingToken: "TX-2023-05-11",
    trip: {
      route: {
        origin: "Lagos",
        destination: "Ibadan"
      },
      bus: {
        plateNo: "DEF-456ZY",
        busType: "Coaster",
        capacity: 18
      },
      departTime: "2023-05-16T10:00:00Z",
      arriveTime: "2023-05-16T12:30:00Z",
      price: 3500
    },
    seat: [{ seatNo: "3C" }],
    passengerTitle: "Ms",
    passengerName: "Jane Smith",
    passengerAddress: "45 Allen Avenue, Ikeja",
    passengerAge: 32,
    nextOfKinName: "John Smith",
    nextOfKinPhone: "+2348098765432",
    email: "jane.smith@email.com",
    mobile: "+2348012345679",
    status: "PENDING",
    createdAt: "2023-05-11T10:15:00Z",
    updatedAt: "2023-05-11T10:30:00Z",
    isSplitPayment: false,
    amountPaid: 0,
    amountDue: 3500,
    isPaymentComplete: false,
  },
];

// Mock trips data for the booking form
const mockTrips = [
  {
    id: "1",
    route: "Lagos → Abuja",
    departTime: "2024-08-05T08:00:00Z",
    arriveTime: "2024-08-05T14:00:00Z",
    price: 8500,
    availableSeatsCount: 12,
    bus: {
      plateNo: "ABC-123XY",
      busType: "Sprinter"
    }
  },
  {
    id: "2",
    route: "Lagos → Ibadan",
    departTime: "2024-08-05T10:00:00Z",
    arriveTime: "2024-08-05T12:30:00Z",
    price: 3500,
    availableSeatsCount: 15,
    bus: {
      plateNo: "DEF-456ZY",
      busType: "Coaster"
    }
  },
  {
    id: "3",
    route: "Abuja → Lagos",
    departTime: "2024-08-05T16:00:00Z",
    arriveTime: "2024-08-05T22:00:00Z",
    price: 8500,
    availableSeatsCount: 8,
    bus: {
      plateNo: "GHI-789AB",
      busType: "Sprinter"
    }
  }
];

// Toggle this to `false` in order to fetch real data from the API instead of using mock
const USE_MOCK_BOOKINGS = false;

const AdminBookings = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds "the array to display"
  // —————————————————————————————————————————————
  const [bookingsData, setBookingsData] = useState([]);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    status: 'PENDING',
    amountPaid: 0,
    amountDue: 0,
    isPaymentComplete: false,
    isSplitPayment: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [issuingTicket, setIssuingTicket] = useState<string | null>(null);

  // —————————————————————————————————————————————
  // 3) React Query hooks
  // —————————————————————————————————————————————
  const { mutateAsync: updateBooking, isPending: isUpdating } = useUpdateBooking();
  const { mutateAsync: retrieveBooking, isPending: isRetrieving } = useRetrieveBooking();
  const { data: apiBookingsRaw = [], isLoading, error } = useBookings();
  const apiBookings = apiBookingsRaw

  // —————————————————————————————————————————————
  // 4) Effect: if mock flag is on, set mock. Otherwise, when API finishes, copy/format it.
  // —————————————————————————————————————————————
  useEffect(() => {
    console.log('API BOOKINGS:', apiBookings)

    if (USE_MOCK_BOOKINGS) {
      setBookingsData(initialBookings);
    } else if (!isLoading && Array.isArray(apiBookings)) {
      // Convert IDs to strings (in case API returns numeric IDs)
      const formatted = apiBookings.map((b: any) => ({
        ...b,
        id: String(b.id),
      }));
      console.log("Formatted booking:", formatted);        
      setBookingsData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(formatted)) return prev;
        return formatted;
      });
    } 
    
  }, [apiBookings, isLoading]);

  // —————————————————————————————————————————————
  // 5) Edit functionality
  // —————————————————————————————————————————————
  const handleEditBooking = (booking: any) => {
    setEditingBooking(booking.id);
    setEditForm({
      status: booking.status || 'PENDING',
      amountPaid: booking.amountPaid || 0,
      amountDue: booking.amountDue || 0,
      isPaymentComplete: booking.isPaymentComplete || false,
      isSplitPayment: booking.isSplitPayment || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditForm({
      status: 'PENDING',
      amountPaid: 0,
      amountDue: 0,
      isPaymentComplete: false,
      isSplitPayment: false,
    });
  };

  const handleSaveBooking = async (bookingId: string) => {
    setIsSubmitting(true);
    try {
      // Calculate amountDue based on trip price and amountPaid
      const booking = bookingsData.find((b: any) => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      const tripPrice = booking?.trip?.price || 0;
      const updatedAmountDue = Math.max(0, tripPrice - editForm.amountPaid);
      const updatedIsPaymentComplete = updatedAmountDue === 0;

      const bookingData = {
        status: editForm.status as any, // Cast to satisfy BookingStatus type
        amountPaid: editForm.amountPaid,
        amountDue: updatedAmountDue,
        isPaymentComplete: updatedIsPaymentComplete,
        isSplitPayment: editForm.isSplitPayment,
      };

      console.log('Updating booking with bookingToken:', booking.bookingToken);

      // API call to update booking
      await updateBooking({
        bookingData: {
          bookingToken: booking.bookingToken,
          status: editForm.status,
          amountPaid: editForm.amountPaid,
          amountDue: updatedAmountDue,
          isPaymentComplete: updatedIsPaymentComplete,
          isSplitPayment: editForm.isSplitPayment,
        }
      });

      // Update local state
      setBookingsData((prev: any) => prev.map((b: any) => 
        b.bookingToken === booking.bookingToken 
          ? { ...b, ...bookingData, updatedAt: new Date().toISOString() }
          : b
      ));

      setEditingBooking(null);
      setEditForm({
        status: 'PENDING',
        amountPaid: 0,
        amountDue: 0,
        isPaymentComplete: false,
        isSplitPayment: false,
      });
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickConfirm = async (booking: any) => {
    setIsSubmitting(true);
    try {
      const tripPrice = booking?.trip?.price || 0;
      const bookingData = {
        status: 'CONFIRMED' as any, // Cast to satisfy BookingStatus type
        amountPaid: tripPrice,
        amountDue: 0,
        isPaymentComplete: true,
      };

      // API call to update booking
      await updateBooking({
        bookingData: {
        bookingToken: booking.bookingToken,
        status: 'CONFIRMED',
        amountPaid: tripPrice,
        amountDue: 0,
        isPaymentComplete: true,
  }
      });

      // Update local state
      setBookingsData((prev: any) => prev.map((b: any) => 
        b.bookingToken === booking.bookingToken
          ? { ...b, ...bookingData, updatedAt: new Date().toISOString() }
          : b
      ));

      alert('Booking confirmed and payment marked as complete!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // —————————————————————————————————————————————
  // 6) Issue Ticket functionality
  // —————————————————————————————————————————————
  const handleIssueTicket = async (booking: any) => {
    setIssuingTicket(booking.id);
    try {
      const ticketData = await retrieveBooking({
        bookingToken: booking.bookingToken,
        email: booking.email
      });

      console.log('Ticket issued successfully:', ticketData);
      alert('Ticket issued successfully!');
    } catch (error) {
      console.error('Error issuing ticket:', error);
      alert('Failed to issue ticket. Please try again.');
    } finally {
      setIssuingTicket(null);
    }
  };

  // —————————————————————————————————————————————
  // 7) booking handlers
  // —————————————————————————————————————————————
  const handleBookingSubmit = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to create booking
      console.log('Creating booking:', bookingData);
      
      // Mock API response
      const newBooking = {
        id: String(Date.now()),
        bookingToken: `TX-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        trip: mockTrips.find(t => t.id === String(bookingData.tripId)),
        seat: [{ seatNo: "1A" }], // Mock seat assignment
        passengerTitle: "Mr", // Default title
        passengerName: bookingData.passengerName,
        passengerAddress: bookingData.passengerAddress,
        passengerAge: null,
        nextOfKinName: bookingData.nextOfKinName,
        nextOfKinPhone: bookingData.nextOfKinPhone,
        email: bookingData.email,
        mobile: bookingData.mobile,
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSplitPayment: false,
        amountPaid: bookingData.isPaymentComplete ? mockTrips.find(t => t.id === String(bookingData.tripId))?.price || 0 : 0,
        amountDue: bookingData.isPaymentComplete ? 0 : mockTrips.find(t => t.id === String(bookingData.tripId))?.price || 0,
        isPaymentComplete: bookingData.isPaymentComplete,
      };

      // Add to local state
      setBookingsData((prev: any) => [newBooking, ...prev]);
      
      setIsCreateModalOpen(false);
      alert('booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingCancel = () => {
    setIsCreateModalOpen(false);
  };

  // —————————————————————————————————————————————
  // 8) Only show loader/error if we're NOT using mock
  // —————————————————————————————————————————————
  if (!USE_MOCK_BOOKINGS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_BOOKINGS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load bookings. Please try again.</p>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 9) Define comprehensive columns for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { 
      key: "bookingToken", 
      title: "Booking Token",
      render: (booking: any) => (
        <span className="font-mono text-sm">{booking.bookingToken}</span>
      )
    },
    { 
      key: "trip", 
      title: "Route",
      render: (booking: any) => (
        <div className="flex flex-col min-w-[140px]">
          <span className="font-medium">
            {booking?.trip?.route?.origin} ➡️ {booking?.trip?.route?.destination}
          </span>
          <span className="text-xs text-gray-500">
            {booking?.trip?.departTime && new Date(booking.trip.departTime).toLocaleDateString()}
          </span>
        </div>
      )
    },
    {
      key: "bus",
      title: "Bus Details", 
      render: (booking: any) => (
        <div className="text-sm min-w-[120px]">
          <div className="font-medium font-mono">
            {booking?.trip?.bus?.plateNo || 'N/A'}
          </div>
          <div className="text-gray-600 capitalize">
            {booking?.trip?.bus?.busType || 'N/A'}
          </div>
          {booking?.trip?.bus?.capacity && (
            <div className="text-xs text-gray-500">
              {booking.trip.bus.capacity} seats
            </div>
          )}
        </div>
      )
    },
    {
      key: "schedule",
      title: "Schedule", 
      render: (booking: any) => (
        <div className="text-sm min-w-[100px]">
          <div>Depart: {booking?.trip?.departTime && new Date(booking.trip.departTime).toLocaleTimeString()}</div>
          <div>Arrive: {booking?.trip?.arriveTime && new Date(booking.trip.arriveTime).toLocaleTimeString()}</div>
        </div>
      )
    },
    { 
      key: "seatNo", 
      title: "Seat(s)",
      render: (booking: any) => (
        <span className="font-mono min-w-[60px] block">
          {booking?.seat?.map((s: any) => s.seatNo).join(', ') || 'N/A'}
        </span>
      )
    },
    {
      key: "passenger",
      title: "Passenger Details",
      render: (booking: any) => (
        <div className="text-sm min-w-[180px]">
          <div className="font-medium">
            {booking.passengerTitle} {booking.passengerName}
          </div>
          <div className="text-gray-600 truncate" title={booking.email}>
            {booking.email}
          </div>
          <div className="text-gray-600">{booking.mobile}</div>
          {booking.passengerAge && <div className="text-gray-500">Age: {booking.passengerAge}</div>}
        </div>
      )
    },
    {
      key: "address",
      title: "Address",
      render: (booking: any) => (
        <div className="text-sm max-w-[150px]">
          <div className="truncate" title={booking.passengerAddress}>
            {booking.passengerAddress}
          </div>
        </div>
      )
    },
    {
      key: "nextOfKin",
      title: "Next of Kin",
      render: (booking: any) => (
        <div className="text-sm min-w-[120px]">
          <div className="font-medium truncate" title={booking.nextOfKinName}>
            {booking.nextOfKinName}
          </div>
          <div className="text-gray-600">{booking.nextOfKinPhone}</div>
        </div>
      )
    },
    {
      key: "paymentComplete",
      title: "Payment Status",
      render: (booking: any) => (
        <div className="text-sm min-w-[100px]">
          {editingBooking === booking.id ? (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.isPaymentComplete}
                  onChange={(e) => setEditForm({...editForm, isPaymentComplete: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-xs">Complete</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.isSplitPayment}
                  onChange={(e) => setEditForm({...editForm, isSplitPayment: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-xs">Split</span>
              </label>
            </div>
          ) : (
            <>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                booking.isPaymentComplete 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  booking.isPaymentComplete ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {booking.isPaymentComplete ? 'Complete' : 'Incomplete'}
              </div>
              {booking.isSplitPayment && (
                <div className="mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Split Payment
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )
    },
    {
      key: "amountPaid",
      title: "Amount Paid",
      render: (booking: any) => (
        <div className="text-sm font-medium min-w-[100px]">
          {editingBooking === booking.id ? (
            <input
              type="number"
              value={editForm.amountPaid}
              onChange={(e) => setEditForm({...editForm, amountPaid: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Amount"
            />
          ) : (
            `₦${booking.amountPaid?.toLocaleString() || '0'}`
          )}
        </div>
      )
    },
    {
      key: "amountDue", 
      title: "Amount Due",
      render: (booking: any) => (
        <div className={`text-sm font-medium min-w-[100px] ${
          booking.amountDue > 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          {editingBooking === booking.id ? (
            <input
              type="number"
              value={editForm.amountDue}
              onChange={(e) => setEditForm({...editForm, amountDue: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Amount Due"
            />
          ) : (
            `₦${booking.amountDue?.toLocaleString() || '0'}`
          )}
        </div>
      )
    },
    {
      key: "tripPrice",
      title: "Trip Price",
      render: (booking: any) => (
        <div className="text-sm font-medium min-w-[80px]">
          ₦{booking?.trip?.price?.toLocaleString() || 'N/A'}
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (booking: any) => (
        <div className="min-w-[120px]">
          {editingBooking === booking.id ? (
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: e.target.value as 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'})}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          ) : (
            <span
              className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "PENDING"
                  ? "bg-blue-100 text-blue-800"
                  : booking.status === "DRAFT"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking.status?.toLowerCase()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "timestamps",
      title: "Timestamps",
      render: (booking: any) => (
        <div className="text-xs text-gray-600 min-w-[140px]">
          <div>Created: {new Date(booking.createdAt).toLocaleString()}</div>
          {booking.updatedAt !== booking.createdAt && (
            <div>Updated: {new Date(booking.updatedAt).toLocaleString()}</div>
          )}
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (booking: any) => (
        <div className="flex gap-2 min-w-[280px]">
          {editingBooking === booking.id ? (
            <>
              <button
                onClick={() => handleSaveBooking(booking.id)}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={12} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
              >
                <X size={12} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEditBooking(booking)}
                className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
              >
                <Edit size={12} />
                Edit
              </button>
              {!booking.isPaymentComplete && (
                <button
                  onClick={() => handleQuickConfirm(booking)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  <Check size={12} />
                  Confirm
                </button>
              )}
              <button
                onClick={() => handleIssueTicket(booking)}
                disabled={issuingTicket === booking.id}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 disabled:opacity-50"
              >
                <Ticket size={12} />
                {issuingTicket === booking.id ? 'Issuing...' : 'Issue Ticket'}
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Booking Management | Corpers Drive Admin</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Booking Management
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive view of all bookings with editing capabilities for
            payment reconciliation
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />New Booking
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={bookingsData}
        keyExtractor={(item) => item.id}
      />

      {/* Custom Full-Screen Modal with Bottom Slide Animation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with fade-in animation */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBookingCancel}
          />
          
          {/* Modal Content with slide-up animation */}
          <div className="relative w-full max-w-7xl mx-4 mb-4 bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">Create New Booking</h2>
              <button
                onClick={handleBookingCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Body with scroll */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] bg-slate-100">
              <BookingForm
                onSubmit={handleBookingSubmit}
                onCancel={handleBookingCancel}
                isSubmitting={isSubmitting}
                trips={mockTrips}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default AdminBookings;