
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useTrips } from "@/hooks/useAdminQueries";
import { SeatStatus, Seat } from "@/services/adminApi";

// Mock seat map data
// const generateSeats = () => {
//   const seatStatus = ["available", "booked", "selected", "reserved", "unavailable"];
//   const seats = [];
//   const rows = 8;
//   const seatsPerRow = 5;
  
//   for (let row = 1; row <= rows; row++) {
//     for (let seat = 1; seat <= seatsPerRow; seat++) {
//       // Skip middle seat in each row to simulate aisle
//       if (seat === 3) continue;
      
//       const randomStatus = seatStatus[Math.floor(Math.random() * 3)]; // Only use first 3 statuses
//       seats.push({
//         id: `${row}${String.fromCharCode(64 + seat)}`, // 1A, 1B, etc.
//         status: randomStatus
//       });
//     }
//   }
  
//   return seats;
// };



const AdminTripSeats = () => {
  const { id } = useParams<{ id: string }>();
  const { data: allTrips = [], isLoading, isError, error } = useTrips();
  const trip = allTrips.find((t) => String(t.id) === id);

  if (isLoading) {
        return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  };
  if (isError || !trip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load seats. Please try again.</p>
      </div>
    );
  };

  const seats = trip.seats;


  const totalSeats = seats.length;

  const available = seats.filter((s) => s.status === "AVAILABLE").length;
  const booked = seats.filter((s) => s.status === "BOOKED").length;
  const reserved = seats.filter((s) => s.status === "RESERVED").length;
  // const unavailable = seats.filter((s) => s.status === "UNAVAILABLE").length;


  // const [seats] = useState(generateSeats());

  const getSeatColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 border-green-500 hover:bg-green-200";
      case "BOOKED":
        return "bg-red-100 border-red-500";
      case "selected":
        return "bg-blue-100 border-blue-500";
      case "RESERVED":
        return "bg-yellow-100 border-yellow-500";
      case "unavailable":
        return "bg-gray-100 border-gray-500";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <>
      <Helmet>
        <title>Trip Seat Map | Copers Drive Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/admin/trips" className="inline-flex items-center text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trips
        </Link>
        
        <h1 className="text-2xl font-bold tracking-tight">Trip Seat Map</h1>
        <p className="text-muted-foreground">Trip ID: {id}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Bus Seat Layout</h2>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-t-3xl flex items-center justify-center border-b-4 border-gray-400">
                <span className="text-xs text-gray-600">Driver</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {seats.map((seat) => (
                <div key={seat.id} className="flex items-center justify-center">
                  {/* Skip the middle column for aisle */}
                  {seat.seatNo.endsWith("C") ? (
                    <div className="w-8 h-8"></div>
                  ) : (
                    <button
                      className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-medium ${getSeatColor(
                        seat.status
                      )}`}
                      disabled={seat.status !== "AVAILABLE"}
                    >
                      {seat.seatNo}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-green-100 border border-green-500 mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-red-100 border border-red-500 mr-2"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-blue-100 border border-blue-500 mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 mr-2"></div>
                <span>Reserved</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-gray-100 border border-gray-500 mr-2"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Seat Actions</h2>
            <div className="space-y-4">
              <Button className="w-full">Reset All Seats</Button>
              <Button className="w-full" variant="outline">Mark Selected as Reserved</Button>
              <Button className="w-full" variant="outline">Mark Selected as Unavailable</Button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Seats:</span>
                  <span>{totalSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span>{available}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booked:</span>
                  <span>{booked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserved:</span>
                  <span>{reserved}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unavailable:</span>
                  <span>{}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminTripSeats;