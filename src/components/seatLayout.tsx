import { useState } from "react";
import SeatContainerProps from "./seatContainer";

const busConfig = {
  sprinter: {
    totalSeats: 14,
    layout: [
      { type: "driver", seats: [], arrangement: "driver" },
      { type: "single", seats: [1], arrangement: "right-single" },
      { type: "row", seats: [2, 3, 4], arrangement: "2-1" },
      { type: "row", seats: [5, 6, 7], arrangement: "2-1" },
      { type: "row", seats: [8, 9, 10], arrangement: "2-1" },
      { type: "back", seats: [11, 12, 13, 14], arrangement: "4-across" },
    ],
  },
  coaster44: {
    totalSeats: 44,
    layout: [
      { type: "driver", seats: [], arrangement: "2-1" },
      { type: "row", seats: [1, 2, 3, 4], arrangement: "2-2" },
      { type: "row", seats: [5, 6, 7, 8], arrangement: "2-2" },
      { type: "row", seats: [9, 10, 11, 12], arrangement: "2-2" },
      { type: "row", seats: [13, 14, 15, 16], arrangement: "2-2" },
      { type: "row", seats: [17, 18, 19, 20], arrangement: "2-2" },
      { type: "row", seats: [21, 22, 23, 24], arrangement: "2-2" },
      { type: "row", seats: [25, 26, 27, 28], arrangement: "2-2" },
      { type: "row", seats: [29, 30, 31, 32], arrangement: "2-2" },
      { type: "row", seats: [33, 34, 35, 36], arrangement: "2-2" }, // Fixed duplicate seats
      { type: "row", seats: [37, 38, 39, 40], arrangement: "2-2" },
      { type: "back", seats: [41, 42, 43, 44], arrangement: "full" },
    ]
  }
};

interface SelectedSeat {
  seatId: number;
  seatNo: string;
}

interface SeatData {
  id: number;
  seatNo: string;
  label: string;
  isAvailable: boolean;
  status?: string;
}

interface BusSeatLayoutProps {
  busType?: keyof typeof busConfig; // Made optional with default
  selectedSeats: SelectedSeat[];
  availableSeats: SeatData[];
  onSeatClick: (seatNo: string, id: number, isAvailable: boolean) => void;
  maxSeats?: number;
}

const BusSeatLayout = ({
  busType = "sprinter", // Default to sprinter if not provided
  selectedSeats,
  availableSeats,
  onSeatClick,
  maxSeats,
}: BusSeatLayoutProps) => {
  // Get the bus configuration based on busType
  const currentBusConfig = busConfig[busType];
  
  // Safety check for undefined config
  if (!currentBusConfig) {
    console.error(`Bus type "${busType}" not found in busConfig`);
    return (
      <div className="bus-layout bg-white p-4 rounded-lg border shadow-sm">
        <div className="text-center text-red-500">
          Invalid bus type: {busType}
        </div>
      </div>
    );
  }

  // Helper function to get seat availability from props
  const getSeatAvailability = (seatNo: string | number) => {
    const seatNoStr = seatNo.toString();
    const seat = availableSeats.find(s => 
      s.seatNo === seatNoStr || 
      s.label === seatNoStr || 
      s.id.toString() === seatNoStr
    );
    return seat ? seat.isAvailable : false;
  };

  // Helper function to get seat ID from props
  const getSeatId = (seatNo: string | number) => {
    const seatNoStr = seatNo.toString();
    const seat = availableSeats.find(s => 
      s.seatNo === seatNoStr || 
      s.label === seatNoStr || 
      s.id.toString() === seatNoStr
    );
    return seat ? seat.id : typeof seatNo === 'number' ? seatNo : parseInt(seatNoStr);
  };

  // Helper function to check if seat is selected
  const isSeatSelected = (seatNo: string | number) => {
    const seatNoStr = seatNo.toString();
    return selectedSeats.some(seat => 
      seat.seatNo === seatNoStr || 
      seat.seatId.toString() === seatNoStr
    );
  };

  // Updated click handler to use prop function
  const handleSeatClick = (seatNo: string | number, id: number) => {
    const isAvailable = getSeatAvailability(seatNo);
    onSeatClick(seatNo.toString(), id, isAvailable);
  };

  const renderRow = (row: any, index: number) => {
    const { type, seats, arrangement } = row;

    switch (type) {
      case "driver":
        return (
          <div key={index} className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center justify-center w-10 h-8 bg-gray-600 text-white rounded text-sm font-bold">
              ✇
            </div>
            <div className="w-4"></div>
            <div className="w-10 h-8"></div> {/* Empty space for balance */}
          </div>
        );

      case "single":
        return (
          <div key={index} className="flex items-center justify-between px-2 mb-2">
            <div className="w-10 h-8"></div> {/* Empty space */}
            <div className="w-4"></div>
            <SeatContainerProps
              id={getSeatId(seats[0])}
              isAvailable={getSeatAvailability(seats[0])}
              isSelected={isSeatSelected(seats[0])}
              seatNo={seats[0].toString()}
              onClick={handleSeatClick}
            />
          </div>
        );

      case "row":
        if (arrangement === "2-1") {
          return (
            <div key={index} className="flex items-center justify-between px-2 mb-2">
              <div className="flex space-x-2">
                <SeatContainerProps
                  id={getSeatId(seats[0])}
                  isAvailable={getSeatAvailability(seats[0])}
                  isSelected={isSeatSelected(seats[0])}
                  seatNo={seats[0].toString()}
                  onClick={handleSeatClick}
                />
                <SeatContainerProps
                  id={getSeatId(seats[1])}
                  isAvailable={getSeatAvailability(seats[1])}
                  isSelected={isSeatSelected(seats[1])}
                  seatNo={seats[1].toString()}
                  onClick={handleSeatClick}
                />
              </div>
              <div className="w-4"></div>
              <SeatContainerProps
                id={getSeatId(seats[2])}
                isAvailable={getSeatAvailability(seats[2])}
                isSelected={isSeatSelected(seats[2])}
                seatNo={seats[2].toString()}
                onClick={handleSeatClick}
              />
            </div>
          );
        } else if (arrangement === "2-2") {
          return (
            <div key={index} className="flex items-center justify-between px-2 mb-2">
              <div className="flex space-x-2">
                <SeatContainerProps
                  id={getSeatId(seats[0])}
                  isAvailable={getSeatAvailability(seats[0])}
                  isSelected={isSeatSelected(seats[0])}
                  seatNo={seats[0].toString()}
                  onClick={handleSeatClick}
                />
                <SeatContainerProps
                  id={getSeatId(seats[1])}
                  isAvailable={getSeatAvailability(seats[1])}
                  isSelected={isSeatSelected(seats[1])}
                  seatNo={seats[1].toString()}
                  onClick={handleSeatClick}
                />
              </div>
              <div className="w-6 border-l border-dashed border-gray-400 h-8 flex items-center justify-center">
                <div className="text-xs text-gray-500">|</div>
              </div>
              <div className="flex space-x-2">
                <SeatContainerProps
                  id={getSeatId(seats[2])}
                  isAvailable={getSeatAvailability(seats[2])}
                  isSelected={isSeatSelected(seats[2])}
                  seatNo={seats[2].toString()}
                  onClick={handleSeatClick}
                />
                <SeatContainerProps
                  id={getSeatId(seats[3])}
                  isAvailable={getSeatAvailability(seats[3])}
                  isSelected={isSeatSelected(seats[3])}
                  seatNo={seats[3].toString()}
                  onClick={handleSeatClick}
                />
              </div>
            </div>
          );
        }
        break;

      case "back":
        return (
          <div key={index} className="flex justify-center space-x-2 pt-2 border-t border-gray-300">
            {seats.map((seatNo: number) => (
              <SeatContainerProps
                key={seatNo}
                id={getSeatId(seatNo)}
                isAvailable={getSeatAvailability(seatNo)}
                isSelected={isSeatSelected(seatNo)}
                seatNo={seatNo.toString()}
                onClick={handleSeatClick}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bus-layout bg-white p-4 rounded-lg border shadow-sm">
      <div className="bus-container max-w-xs mx-auto">
        {currentBusConfig.layout.map((row, index) => renderRow(row, index))}
      </div>
    </div>
  );
};

export default BusSeatLayout;