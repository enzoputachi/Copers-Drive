import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useTrips, useUpdateSeats } from "@/hooks/useAdminQueries";
import { SeatStatus, Seat } from "@/services/adminApi";
import { toast } from "sonner";

const AdminTripSeats = () => {
  const { id } = useParams<{ id: string }>();
  const { data: allTrips = [], isLoading, isError, error } = useTrips();
  const trip = allTrips.find((t) => String(t.id) === id);
  const [tempDisableReserve, setTempDisableReserve] = useState(true)
  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate: bulkUpdateSeats, isPending } = useUpdateSeats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load seats. Please try again.</p>
      </div>
    );
  }

  const seats = trip.seats;
  const totalSeats = seats.length;
  const available = seats.filter((s) => s.status === "AVAILABLE").length;
  const booked = seats.filter((s) => s.status === "BOOKED").length;
  const reserved = seats.filter((s) => s.status === "RESERVED").length;
  const unavailable = seats.filter((s) => s.status === "UNAVAILABLE").length;

  // Handle seat selection
  const handleSeatClick = (seatId: string, seatStatus: string) => {
    // Only allow selection of available seats or deselection of selected seats
    if (seatStatus === "AVAILABLE" || selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => 
        prev.includes(seatId) 
          ? prev.filter(id => id !== seatId)
          : [...prev, seatId]
      );
    }
  };

  // Reserve selected seats
  const handleReserveSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select seats to reserve");
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Implement API call to reserve seats
      // await reserveSeats(selectedSeats);
      
      // For now, just show a success message
      alert(`Reserved ${selectedSeats.length} seat(s) successfully!`);
      setSelectedSeats([]);
      
      // You would typically refetch the trip data here
      // refetch();
    } catch (error) {
      console.error("Failed to reserve seats:", error);
      alert("Failed to reserve seats. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Mark seats as unavailable
  const handleMarkUnavailable = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select seats to mark as unavailable");
      return;
    }

    setIsUpdating(true);
    try {
      bulkUpdateSeats({
        seatIds: selectedSeats.map((id) => Number(id)),
        data: { status: 'UNAVAILABLE' as SeatStatus },
      }, {
        onSuccess: () => setSelectedSeats([]),
      });
      
      alert(`Marked ${selectedSeats.length} seat(s) as unavailable!`);
      setSelectedSeats([]);
    } catch (error) {
      console.error("Failed to mark seats as unavailable:", error);
      alert("Failed to update seats. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset all seats to available
  const handleResetAllSeats = async () => {
    if (!confirm("Are you sure you want to reset all seats to available?")) {
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Implement API call to reset all seats
      // await resetAllSeats(trip.id);
      
      alert("All seats have been reset to available!");
      setSelectedSeats([]);
    } catch (error) {
      console.error("Failed to reset seats:", error);
      alert("Failed to reset seats. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id.toString())) {
      return "bg-blue-100 border-blue-500 border-2";
    }
    
    switch (seat.status) {
      case "AVAILABLE":
        return "bg-green-100 border-green-500 hover:bg-green-200 cursor-pointer";
      case "BOOKED":
        return "bg-red-100 border-red-500 cursor-not-allowed";
      case "RESERVED":
        return "bg-yellow-100 border-yellow-500 cursor-not-allowed";
      case "UNAVAILABLE":
        return "bg-gray-100 border-gray-500 cursor-not-allowed";
      default:
        return "bg-gray-100 cursor-not-allowed";
    }
  };

  return (
    <>
      <Helmet>
        <title>Trip Seat Map | Corpers Drive Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <Link to="/admin/trips" className="inline-flex items-center text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trips
        </Link>
        
        <h1 className="text-2xl font-bold tracking-tight">Trip Seat Map</h1>
        <p className="text-muted-foreground">Trip ID: {id}</p>
        {selectedSeats.length > 0 && (
          <p className="text-blue-600 mt-2">
            {selectedSeats.length} seat(s) selected
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Bus Seat Layout</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click on available seats to select them for reservation
            </p>
            
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
                      className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                      onClick={() => handleSeatClick(`${seat.id}`, seat.status)}
                      disabled={seat.status !== "AVAILABLE" && !selectedSeats.includes(`${seat.id}`)}
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
                <span>Available (Click to select)</span>
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
              <Button 
                className="w-full"
                 variant="outline"
                onClick={handleReserveSeats}
                disabled={selectedSeats.length === 0 || tempDisableReserve}
              >
                {isUpdating ? "Reserving..." : `Reserve Selected (${selectedSeats.length})`}
              </Button>
              
              <Button 
                className="w-full" 
                // variant="outline"
                onClick={handleMarkUnavailable}
                disabled={selectedSeats.length === 0 || isUpdating}
              >
                Mark Selected as Unavailable
              </Button>
              
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={handleResetAllSeats}
                disabled={tempDisableReserve} // isUpdating
              >
                Reset All Seats
              </Button>
              
              {selectedSeats.length > 0 && (
                <Button 
                  className="w-full" 
                  variant="ghost"
                  onClick={() => setSelectedSeats([])}
                >
                  Clear Selection
                </Button>
              )}
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
                  <span>{unavailable}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Selected:</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminTripSeats;