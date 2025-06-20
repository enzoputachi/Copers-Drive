import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { useBookings } from "@/hooks/useAdminQueries";

// —————————————————————————————————————————————
// 1) Mock bookings data (IDs as strings)
// —————————————————————————————————————————————
const initialBookings = [
  {
    id: "1",
    bookingToken: "TX-2023-05-10",
    trip: "Lagos to Abuja",
    seatNo: "5A",
    passengerName: "John Doe",
    status: "confirmed",
    createdAt: "2023-05-10T09:30:00Z",
  },
  {
    id: "2",
    bookingToken: "TX-2023-05-11",
    trip: "Lagos to Ibadan",
    seatNo: "3C",
    passengerName: "Jane Smith",
    status: "completed",
    createdAt: "2023-05-11T10:15:00Z",
  },
  {
    id: "3",
    bookingToken: "TX-2023-05-12",
    trip: "Abuja to Kaduna",
    seatNo: "8D",
    passengerName: "Robert Johnson",
    status: "pending",
    createdAt: "2023-05-12T14:45:00Z",
  },
  {
    id: "4",
    bookingToken: "TX-2023-05-13",
    trip: "Port Harcourt to Calabar",
    seatNo: "2B",
    passengerName: "Emily Williams",
    status: "canceled",
    createdAt: "2023-05-13T08:20:00Z",
  },
];

// Toggle this to `false` in order to fetch real data from the API instead of using mock
const USE_MOCK_BOOKINGS = false;

const AdminBookings = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds “the array to display”
  // —————————————————————————————————————————————
  const [bookingsData, setBookingsData] = useState([]);

  // —————————————————————————————————————————————
  // 3) React Query hooks
  // —————————————————————————————————————————————
  const { data: apiBookings = [], isLoading, error } = useBookings();

  // —————————————————————————————————————————————
  // 4) Effect: if mock flag is on, set mock. Otherwise, when API finishes, copy/format it.
  // —————————————————————————————————————————————
  useEffect(() => {
    console.log('API BOOKINGS:', apiBookings)

    if (USE_MOCK_BOOKINGS) {
      setBookingsData(initialBookings);
    } 

    if (!isLoading && Array.isArray(apiBookings)) {
      // Convert IDs to strings (in case API returns numeric IDs)
      const formatted = apiBookings.map((b: any) => ({
        ...b,
        id: String(b.id),
      }));
      console.log("Formattted booking:", formatted);        
      setBookingsData(formatted);
    } 
    
  }, [apiBookings, isLoading]);

  // —————————————————————————————————————————————
  // 5) Only show loader/error if we’re NOT using mock
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
  // 6) Define columns for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { key: "bookingToken", title: "Booking ID" },
    { key: "trip", title: "Trip" },
    { key: "seatNo", title: "Seat" },
    { key: "passengerName", title: "Passenger" },
    {
      key: "status",
      title: "Status",
      render: (booking: any) => (
        <span
          className={`capitalize ${
            booking.status === "confirmed"
              ? "text-green-600"
              : booking.status === "completed"
              ? "text-blue-600"
              : booking.status === "pending"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {booking.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (booking: any) =>
        new Date(booking.createdAt).toLocaleString(),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Booking Management | Copers Drive Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Booking Management
        </h1>
      </div>

      <DataTable
        columns={columns}
        data={bookingsData}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

export default AdminBookings;
