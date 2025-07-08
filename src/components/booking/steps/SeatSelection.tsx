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
 console.log("PpreviousBusIdRef:", previousBusIdRef);
 
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

  // Initialize local selected seats from store only on first load
  // useEffect(() => {
  //   // Only set from store if we have the same bus and no local selections yet
  //   if (selectedSeats.length > 0 && localSelected.length === 0 && selectedBus?.id === previousBusIdRef.current) {
  //     setLocalSelected(selectedSeats);
  //   }
  // }, [selectedSeats, localSelected.length, selectedBus?.id]);

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
      isAvailable: seat.status === 'AVAILABLE',
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
  // Fixed mapSeatsForBusLayout function
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
        id: index + 1,                    // Use index + 1 instead of seat.id
        seatNo: (index + 1).toString(),
        label: (index + 1).toString(),
        isAvailable: seat.status === 'AVAILABLE',
        status: seat.status,
        originalId: seat.id               // Keep original ID for reference if needed
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
        <DialogContent className="max-w-[480px] max-h-[85vh] w-full bg-gray-50 p-4 border rounded-xl">
          <DialogHeader>
            <DialogTitle>Select Your Seats</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] mt-4 pb-4 scrollbar-minimal">

            {/* Legend */}
            <div className="mb-6 flex justify-center space-x-4">
              <Legend />
            </div>

            {/* Seat map */}
            <div className="seat-map mx-auto">
              <BusSeatLayout
                busType={getBusType()}
                selectedSeats={localSelected}
                availableSeats={mapSeatsForBusLayout()}
                onSeatClick={handleSeatClick}
                maxSeats={passengers}
              />
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