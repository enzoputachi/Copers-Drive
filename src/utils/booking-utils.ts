
import { format } from "date-fns";

// Format price in Naira
export const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString()}`;
};

// Format date for display
export const formatDisplayDate = (date: Date | null): string => {
  if (!date) return "N/A";
  return format(date, "EEEE, MMMM d, yyyy");
};

// Format date for API requests
export const formatApiDate = (date: Date | null): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

// Calculate time difference between two time strings (HH:MM AM/PM format)
export const calculateDuration = (startTime: string, endTime: string): string => {
  // This is a simplified implementation - in a real app, you'd need to handle
  // AM/PM properly and edge cases like overnight trips
  const getMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    
    if (hours === "12") {
      hours = "0";
    }
    
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };
  
  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);
  
  let diffMinutes = endMinutes - startMinutes;
  
  // Handle overnight trips
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

// Generate seat availability for a bus
export const generateSeatAvailability = (
  totalSeats: number, 
  bookedSeatIds: string[] = []
) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4); // 4 seats per row
  const seatLetters = ['A', 'B', 'C', 'D'];
  
  for (let row = 1; row <= rows; row++) {
    for (let seatIndex = 0; seatIndex < 4; seatIndex++) {
      if ((row - 1) * 4 + seatIndex < totalSeats) {
        const seatId = `${seatLetters[seatIndex]}${row}`;
        seats.push({
          id: seatId,
          isAvailable: !bookedSeatIds.includes(seatId)
        });
      }
    }
  }
  
  return seats;
};

// Validate booking is complete 
export const validateCompleteBooking = (booking: any): boolean => {
  const requiredFields = [
    'departure',
    'destination', 
    'date',
    'selectedBus',
    'selectedSeats',
    'passengerInfo',
    'paymentInfo'
  ];
  
  return requiredFields.every(field => {
    if (field === 'selectedSeats') {
      return booking[field] && booking[field].length > 0;
    }
    return !!booking[field];
  });
};
