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
import { useValidateTripDetails } from "@/hooks/useApi";
import React from "react";

// Toggle between mock and live at build/config time
const USE_MOCK_DATA = false;

interface SeatSelectionProps {
  onComplete: () => void;
  setStepComplete: (stepId: string, isComplete: boolean) => void;
}

const BUS_LAYOUT = {
  rows: 10,
  seatsPerRow: 4,
  unavailableSeats: ['A1','B3','C2','D5','A7','B8','C10','D4','A3','B10'],
};

const SeatSelection = ({ onComplete, setStepComplete }: SeatSelectionProps) => {
  const { selectedBus, passengers, selectedSeats, setSelectedSeats } = useBookingStore();
  const [dialogOpen, setDialogOpen] = useState(true);
  
  // Fetch seats via React Query hook when live
  const {
    data: apiSeats = [],
    isLoading,
    error,
  } = useValidateTripDetails(Number(selectedBus?.id));

  // Local selected seats
  const [localSelected, setLocalSelected] = useState<SelectedSeat[]>(selectedSeats || []);
  const lastStepCompleteRef = useRef<boolean>();

  

  // Sync selection and step
  useEffect(() => {
    const isComplete = localSelected.length === passengers;

    // Prevent infinite loop
    const selectedChanged =
      localSelected.length !== selectedSeats.length ||
      localSelected.some((s, i) => s.seatNo !== selectedSeats[i]?.seatNo);

    if (selectedChanged) {
      setSelectedSeats(localSelected);
      console.log("Selected seat:", localSelected);
      
    }

    if (lastStepCompleteRef.current !== isComplete) {
      lastStepCompleteRef.current = isComplete;
      setStepComplete('seatSelection', isComplete);
    }
  }, [localSelected, passengers, selectedSeats, setSelectedSeats, setStepComplete]);

  // Generate mock grid
  const generateMock = () => {
    const seatLetters = ['A','B','C','D'];
    let idCounter = 0;
    const rows = [] as any[];
    for (let row = 1; row <= BUS_LAYOUT.rows; row++) {
      const rowSeats: any[] = [];
      for (let i = 0; i < BUS_LAYOUT.seatsPerRow; i++) {
        idCounter++;
        const label = `${seatLetters[i]}${row}`;
        const isUnavailable = BUS_LAYOUT.unavailableSeats.includes(label);
        const isSelected = localSelected.some(s => s.seatNo === label);
        rowSeats.push({ id: idCounter, label, isAvailable: !isUnavailable, isSelected });
      }
      rows.push(rowSeats);
    }
    return rows;
  };

  // Generate grid from API data
  const generateFromApi = () => {
    const rows = [] as any[];
    const flat = apiSeats.map(seat => ({
      id: seat.id,
      label: seat.seatNo,
      isAvailable: seat.status === 'AVAILABLE',
      isSelected: localSelected.some(s => s.seatNo === seat.seatNo),
    }));
    for (let i = 0; i < flat.length; i += BUS_LAYOUT.seatsPerRow) {
      rows.push(flat.slice(i, i + BUS_LAYOUT.seatsPerRow));
    }
    return rows;
  };

  const seats = USE_MOCK_DATA ? generateMock() : generateFromApi();

  // Handle seat click
  const handleSeatClick = (label: string, id: number, available: boolean) => {
    if (!available) return;
    setLocalSelected(prev => {
      const exists = prev.find(s => s.seatId === id);
      if (exists) return prev.filter(s => s.seatId !== id);
      if (prev.length >= passengers) {
        toast.error(`You can only select ${passengers} seat${passengers > 1 ? 's' : ''}`);
        return prev;
      }
      return [...prev, { seatId: id, seatNo: label }];
    });
  };

  // “Continue” outside dialog opens it when exactly right number selected
  const handleContinue = () => {
    if (localSelected.length === passengers) {
      setDialogOpen(true);
    } else {
      toast.error(`Select exactly ${passengers} seat${passengers > 1 ? 's' : ''}`);
    }
  };

  if (!USE_MOCK_DATA && isLoading) {
    return <p>Loading seats...</p>;
  }
  if (!USE_MOCK_DATA && error) {
    return <p className="text-red-600">Error loading seats. Please try again.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Your Seats</h2>
      {!selectedBus && <p className="text-amber-600 mb-4">Please select a bus first.</p>}

      <div className="mb-6">
        <h3 className="font-medium mb-2">Selected Seats</h3>
        {localSelected.length ? (
          <div className="flex flex-wrap gap-2">
            {localSelected.map(({ seatId, seatNo }) => (
              <span key={seatId} className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {seatNo}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No seats selected yet</p>
        )}
      </div>

      <p className="mb-4">
        Please select <strong>{passengers}</strong> seat{passengers > 1 && 's'}. You have selected <strong>{localSelected.length}</strong>.
      </p>

      {/* Show “Change Seats” once full selection is made */}
      {(
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={() => setDialogOpen(true)}
        >
          {localSelected.length ? "Change Seats" : "Select Seats"}
        </Button>
      )}

      <Button
        onClick={handleContinue}
        className="w-full mb-4"
        disabled={localSelected.length !== passengers}
      >
        Continue to Passenger Information
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[500px] max-h-[30rem] w-full">
          <DialogHeader>
            <DialogTitle>Select Your Seats</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto scrollbar-hide max-h-[16rem] mt-4 pb-9">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 h-8 w-32 rounded-t-3xl flex items-center justify-center text-sm">
                DRIVER
              </div>
            </div>
            <div className="mb-6 flex justify-center space-x-4">
              <Legend />
            </div>
            <div className="seat-map grid gap-4 px-4">
              {seats.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center">
                  {row.map((seat, sIdx) => (
                    <React.Fragment key={seat.id}>
                      {sIdx === 2 && <div className="w-8"></div>}
                      <button
                        className={`w-10 h-10 rounded-t-lg border flex items-center justify-center ${
                          !seat.isAvailable
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : seat.isSelected
                              ? 'bg-primary text-white'
                              : 'bg-white hover:border-primary'
                        }`}
                        onClick={() => handleSeatClick(seat.label, seat.id, seat.isAvailable)}
                        disabled={!seat.isAvailable}
                      >
                        {seat.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onComplete();
                  setDialogOpen(false);
                }}
                disabled={localSelected.length !== passengers}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Legend = () => (
  <>
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-white border rounded"></div><span>Available</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-gray-400 rounded"></div><span>Unavailable</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-primary rounded"></div><span>Selected</span>
    </div>
  </>
);

export default SeatSelection;
