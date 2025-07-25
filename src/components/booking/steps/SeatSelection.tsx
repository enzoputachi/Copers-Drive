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
import SeatIcon from "@/components/ui/seat";
import BusSeatLayout from "@/components/seatLayout";
import { Check } from "lucide-react";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch seats via React Query hook when live
  const {
    data: apiSeats = [],
    isLoading,
    error,
  } = useValidateTripDetails(Number(selectedBus?.id));

  // Local selected seats - Initialize as empty array to avoid stale state
  const [localSelected, setLocalSelected] = useState<SelectedSeat[]>([]);
  const lastStepCompleteRef = useRef<boolean>();
  const previousBusIdRef = useRef<string | null>(null);
 console.log("Api Seats:", apiSeats);
 
  // Reset seat selection when bus changes
  useEffect(() => {
    const currentBusId = selectedBus?.id;
    
    // If bus has changed, clear all seat selections
    if (currentBusId && previousBusIdRef.current !== null && previousBusIdRef.current !== currentBusId) {
      console.log("Bus changed, clearing seat selections");
      setLocalSelected([]);
      setSelectedSeats([]);
    }
    
    previousBusIdRef.current = currentBusId || null;
  }, [selectedBus?.id, setSelectedSeats]);

  useEffect(() => {
    if (!selectedBus) {
      console.log("No bus selected, clearing seat selections");
      setLocalSelected([]);
      setSelectedSeats([]);
    }
  }, [selectedBus, setSelectedSeats]);

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
    const flat = [...apiSeats]
      .sort((a, b) => Number(a.seatNo) - Number(b.seatNo))
      .map(seat => ({
      id: seat.id,
      label: seat.seatNo,
      isAvailable: seat.isAvailable,
      isSelected: localSelected.some(s => s.seatNo === seat.seatNo),
      type: 'seat' as const,
    }));
    
    const rows = [] as any[];
    const perRow = BUS_LAYOUT.seatsPerRow;

    for (let i = 0; i < flat.length; i += perRow) {
      rows.push(flat.slice(i, i + perRow));
    }
    console.log("Rows:", rows);
    
    return rows;
  };

  const seats = USE_MOCK_DATA ? generateMock() : generateFromApi();

  // Map seats for BusSeatLayout (14-seat bus format)
  const mapSeatsForBusLayout = () => {
    const busType = getBusType();
    const maxSeats = busType === "sprinter" ? 14 : busType === "coaster44" ? 44 : 51;
    
    if (USE_MOCK_DATA) {
      const flatSeats = seats.flat().slice(0, maxSeats);
      return flatSeats.map((seat, index) => ({
        id: index + 1,
        seatNo: (index + 1).toString(),
        label: (index + 1).toString(),
        isAvailable: seat.isAvailable,
        status: seat.isAvailable ? 'AVAILABLE' : 'OCCUPIED'
      }));
    } else {
      const sortedSeats = [...apiSeats]
        .sort((a, b) => Number(a.seatNo) - Number(b.seatNo))
        .slice(0, maxSeats);
      
      return sortedSeats.map((seat, index) => ({
        id: seat.id,
        seatNo: seat.seatNo,
        label: seat.seatNo,
        isAvailable: seat.isAvailable,
        status: seat.status,
        originalId: seat.id
      }));
    }
  };

  // Handle seat click with improved logic
  const handleSeatClick = (label: string, id: number, available: boolean) => {
    if (!available) {
      toast.error("This seat is not available");
      return;
    }
    
    setLocalSelected(prev => {
      const exists = prev.find(s => s.seatId === id);
      
      if (exists) {
        // Remove the seat
        console.log("Removing seat:", label);
        return prev.filter(s => s.seatId !== id);
      } else {
        // Add the seat if under limit
        if (prev.length >= passengers) {
          toast.error(`You can only select ${passengers} seat${passengers > 1 ? 's' : ''}`);
          return prev;
        }
        console.log("Adding seat:", label);
        return [...prev, { seatId: id, seatNo: label }];
      }
    });
  };

  // Clear all selections
  const clearAllSelections = () => {
    setLocalSelected([]);
    setSelectedSeats([]);
  };

  // "Continue" outside dialog opens it when exactly right number selected
  const handleContinue = () => {
    if (localSelected.length === passengers) {
      setDialogOpen(true);
    } else {
      toast.error(`Select exactly ${passengers} seat${passengers > 1 ? 's' : ''}`);
    }
  };

  // Auto-confirm when correct number of seats selected
  // const handleAutoConfirm = () => {
  //   if (localSelected.length === passengers) {
  //     onComplete();
  //     setDialogOpen(false);
  //     toast.success(`${passengers} seat${passengers > 1 ? 's' : ''} selected successfully!`);
  //   }
  // };

  // Trigger auto-confirm when selection is complete
  // useEffect(() => {
  //   if (dialogOpen && localSelected.length === passengers) {
  //     // Small delay to let user see their final selection
  //     const timer = setTimeout(handleAutoConfirm, 800);
  //     return () => clearTimeout(timer);
  //   }
  // }, [localSelected.length, passengers, dialogOpen]);

  if (!USE_MOCK_DATA && isLoading) {
    return <p>Loading seats...</p>;
  }

  if (!USE_MOCK_DATA && error) {
    return <p className="text-red-600">Error loading seats. Please try again.</p>;
  }

  const getBusType = () => {
    const totalSeats = apiSeats.length;
    if (totalSeats <= 14) {
      return "sprinter";
    } else if (totalSeats <= 44) {
      return "coaster44";
    } else if (totalSeats <= 51) {
      return "coaster51"
    }
    return "coaster44"
  }

  const isSelectionComplete = localSelected.length === passengers;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Your Seats</h2>
      {!selectedBus && <p className="text-amber-600 mb-4">Please select a bus first.</p>}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Selected Seats</h3>
          {localSelected.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSelections}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
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

      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={() => setDialogOpen(true)}
      >
        {localSelected.length ? "Change Seats" : "Select Seats"}
      </Button>

      <Button
        onClick={handleContinue}
        className="w-full mb-4"
        disabled={localSelected.length !== passengers}
      >
        Continue to Passenger Information
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[480px] max-h-[90vh] w-full bg-gray-50 p-4 border rounded-xl flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Select Your Seats</span>
              <div className="text-sm text-gray-600">
                {localSelected.length}/{passengers} selected
                {isSelectionComplete && (
                  <span className="text-green-600 ml-2 font-medium">✓ Complete</span>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto mt-4 min-h-0">
            {/* Compact progress indicator */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isSelectionComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(localSelected.length / passengers) * 100}%` }}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex justify-center space-x-4">
              <Legend />
            </div>

            {/* Seat map */}
            <div className="seat-map mx-auto pb-4">
              <BusSeatLayout
                busType={getBusType()}
                selectedSeats={localSelected}
                availableSeats={mapSeatsForBusLayout()}
                onSeatClick={handleSeatClick}
                maxSeats={passengers}
              />
            </div>
          </div>

          {/* Fixed footer with buttons */}
          <div className="flex-shrink-0 pt-4 border-t mt-4">
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onComplete();
                  setDialogOpen(false);
                  toast.success(`${passengers} seat${passengers > 1 ? 's' : ''} confirmed!`);
                }}
                disabled={!isSelectionComplete}
                className={`flex-1 ${isSelectionComplete ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isSelectionComplete ? (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Confirm
                  </div>
                ) : (
                  `Select ${passengers - localSelected.length} More`
                )}
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
    <div className="flex justify-center space-x-6 text-xs">
      <div className="flex items-center space-x-2">
        <div className="scale-75">
          <SeatIcon isAvailable={true} isSelected={true} />
        </div>
        <span>Selected</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="scale-75">
          <SeatIcon isAvailable={true} isSelected={false} />
        </div>
        <span>Available</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="scale-75">
          <SeatIcon isAvailable={false} isSelected={false} />
        </div>
        <span>Occupied</span>
      </div>
    </div>
  </>
);

export default SeatSelection;