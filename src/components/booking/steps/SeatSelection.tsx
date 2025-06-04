
import { useState, useEffect, useRef } from "react";
import { SelectedSeat, useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface SeatSelectionProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

// Seat arrangement configuration
const BUS_LAYOUT = {
  rows: 10,
  seatsPerRow: 4, // 2 on each side with an aisle
  unavailableSeats: ['A1', 'B3', 'C2', 'D5', 'A7', 'B8', 'C10', 'D4', 'A3', 'B10']
};


const SeatSelection = ({ onComplete, setStepComplete }: SeatSelectionProps) => {
  const { selectedBus, passengers, selectedSeats, setSelectedSeats } = useBookingStore();
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [localSelectedSeats, setLocalSelectedSeats] = useState<SelectedSeat[]>(selectedSeats || []);


  const lastStepCompleteRef = useRef<boolean>();
  
  // Update store and check step completion whenever local selection changes
  useEffect(() => {
    const isComplete = localSelectedSeats.length === passengers;
    if (selectedSeats !== localSelectedSeats) {
      setSelectedSeats(localSelectedSeats);
    }
    if (lastStepCompleteRef.current !== isComplete) {
      lastStepCompleteRef.current = isComplete;
      setStepComplete("seatSelection", isComplete)
    };
  }, [localSelectedSeats, passengers, setSelectedSeats, selectedSeats, setStepComplete]);

  // Generate seats for the bus layout
  const generateSeats = () => {
    const seats: {
      id: number;
      label: string;
      isAvailable: boolean;
      isSelected: boolean;
    }[][] = [];
    const seatLetters = ['A', 'B', 'C', 'D'];
    let seatCounter = 0;
    
    for (let row = 1; row <= BUS_LAYOUT.rows; row++) {
      const rowSeats = [];
      
      for (let seat = 0; seat < BUS_LAYOUT.seatsPerRow; seat++) {
        seatCounter += 1;
        const seatLetter = seatLetters[seat];
        const seatNo = `${seatLetter}${row}`;
        const seatId = seatCounter;
        const isUnavailable = BUS_LAYOUT.unavailableSeats.includes(seatNo);
        const isSelected = localSelectedSeats.some(seat => seat.seatNo === seatNo);
        
        rowSeats.push({
          id: seatId,
          label: seatNo,
          isAvailable: !isUnavailable,
          isSelected
        });
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  const seats = generateSeats();
  
  const handleSeatClick = (seatNo: string, seatId: number, isAvailable: boolean) => {
    if (!isAvailable) return;
    
    setLocalSelectedSeats(prev => {
      // If seat is already selected, remove it
      const exists = prev.find(seat => seat.seatId === seatId)

      if (exists) {
        return prev.filter(seat => seat.seatId !== seatId);
      }
      
      // If already selected max number of seats, show error
      if (prev.length >= passengers) {
        toast.error(`You can only select ${passengers} seat${passengers > 1 ? 's' : ''}`);
        return prev;
      }
      
      // Add the seat to selection
      return [...prev, {seatId, seatNo}];
    });
  };
  
  const handleContinue = () => {
    if (localSelectedSeats.length === passengers) {
      onComplete();
    } else {
      toast.error(`Please select exactly ${passengers} seat${passengers > 1 ? 's' : ''}`);
      setShowSeatMap(true);
    }
  };

  console.log('Seat Selection:', localSelectedSeats);
  
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Your Seats</h2>

      {selectedBus ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Trip Details</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Bus</p>
              <p className="font-medium">{selectedBus.busName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{selectedBus.busType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-medium">{selectedBus.departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Arrival</p>
              <p className="font-medium">{selectedBus.arrivalTime}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-amber-600 mb-4">
          Please go back and select a bus first.
        </p>
      )}

      <div className="mb-6">
        <h3 className="font-medium mb-2">Selected Seats</h3>
        {localSelectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {localSelectedSeats.map(({ seatId, seatNo}) => (
              <span
                key={seatId}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
              >
                Seat {seatNo}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No seats selected yet</p>
        )}
      </div>

      <div className="mb-6">
        <p className="text-sm">
          Please select <span className="font-medium">{passengers}</span> seat
          {passengers > 1 ? "s" : ""}. You have selected{" "}
          <span className="font-medium">{localSelectedSeats.length}</span> seat
          {localSelectedSeats.length !== 1 ? "s" : ""}.
        </p>
      </div>

      <Button
        onClick={() => setShowSeatMap(true)}
        variant="outline"
        className="w-full mb-4"
      >
        {localSelectedSeats.length > 0 ? "Change Seats" : "Select Seats"}
      </Button>

      <Button
        onClick={handleContinue}
        disabled={localSelectedSeats.length !== passengers}
        className="w-full"
      >
        Continue to Passenger Information
      </Button>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatMap} onOpenChange={setShowSeatMap}>
        <DialogContent className="max-w-[500px] max-h-[30rem] w-full">
          <DialogHeader>
            <DialogTitle>Select Your Seats</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[22rem] mt-4">
            <div className="mb-[2rem]">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 h-8 w-32 rounded-t-3xl flex items-center justify-center text-sm font-medium">
                  DRIVER
                </div>
              </div>

              <div className="mb-6 flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-primary rounded"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>

              <div className="seat-map grid gap-4 px-4">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center">
                    {row.map((seat, seatIndex) => {
                      // Add an aisle in the middle (between index 1 and 2)
                      const needsAisle = seatIndex === 2;

                      return (
                        <div key={seat.id} className="flex items-center">
                          {needsAisle && <div className="w-8"></div>}
                          <button
                            className={`w-10 h-10 flex items-center justify-center rounded-t-lg border ${
                              !seat.isAvailable
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : seat.isSelected
                                ? "bg-primary text-white"
                                : "bg-white border-gray-300 hover:border-primary"
                            }`}
                            onClick={() =>
                              handleSeatClick(seat.label, seat.id, seat.isAvailable)
                            }
                            disabled={!seat.isAvailable}
                          >
                            {seat.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowSeatMap(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowSeatMap(false)}
                  disabled={localSelectedSeats.length !== passengers}
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeatSelection;
