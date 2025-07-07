// src/lib/api.ts
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

// ----- Interfaces -----
export interface Route {
  id: number;
  origin: string;
  destination: string;
  distanceKm: number;
  isActive: boolean;
}

export interface Trip {
  id: number;
  departTime: string;  // ISO datetime
  arriveTime: string;
  busId: number;
  routeId: number;
  price: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  bus: {
    busType: string;
    plateNo: string;
    amenities?: string[];
  };
  seats: { isBooked: boolean }[];
}

export interface Bus {
  id: number;
  plateNo: string;
  busType: string;
  capacity: number;
  seatsPerRow: number;
  isActive: boolean;
  bus: {
    busType: string;
    plateNo: string;
    amenities?: string[];
  };
  seats: { isBooked: boolean }[];
}

export interface Seat {
  id: number;
  seatNo: string;
  status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
  tripId: number;
}

export interface Booking {
  id: number;
  tripId: number;
  seatId: number | number[];
  passengerTitle?: string;
  passengerName: string;
  passengerAge?: number;
  nextOfKinName: string;
  nextOfKinPhone: string;
  email: string;
  mobile: string;
  bookingToken: string;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  currency: string;
  provider: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface Notification {
  id: number;
  contactInfo: string;
  type: string;
  message: string;
  sentAt: string;
  bookingId?: number;
}

// ----- Config & Error Handling -----
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // 'https://booking-api-tuso.onrender.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? 'Something went wrong.';
    toast.error(msg);
    return Promise.reject(err);
  }
);

// ----- Routes -----
export const routesApi = {
  listRoutes: () => api.get<Route[]>('/routes'),
  getRoute: (id: number) => api.get<Route>(`/routes/${id}`),
  getFeaturedRoutes: () => api.get<Route[]>('/routes/featured'),
  searchRoutes: (params: { departure: string; destination: string; date: string }) =>
    api.get<Route[]>('/routes/search', { params }),
};

// ----- Trips -----
export const tripsApi = {
  listTrips: () => api.get<Trip[]>('/trips'),
  getTrip: (id: number) => api.get<Trip>(`/trips/${id}`),
  validateTrip: (id: number) => api.get<Trip>(`/trips/${id}/validate`),
  getTripsByRoute: (routeId: number) =>
    api.get<Trip[]>(`/routes/${routeId}/trips`),
  searchTrips: (params: { origin: string; destination: string; date: string }) =>
    api.get<Trip[]>('/trips/search', { params }),
};

// ----- Buses -----
export const busesApi = {
  listBuses: () => api.get<Bus[]>('/buses'),
  getBus: (id: number) => api.get<Bus>(`/buses/${id}`),
};

// ----- Seats -----
export const seatsApi = {
  listSeatsByTrip: (tripId: number) =>
    api.get<Seat[]>(`/trips/${tripId}/seats`),
  reserveSeat: (tripId: number, seatId: number) =>
    api.post<Seat>(`/trips/${tripId}/seats/${seatId}/reserve`),
  releaseSeat: (tripId: number, seatId: number) =>
    api.post<Seat>(`/trips/${tripId}/seats/${seatId}/release`),
};

// ----- Bookings -----
export const bookingsApi = {
  createBookingDraft: (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'bookingToken'>) =>
    api.post<Booking>('/bookings', data),
  getBooking: (id: number) => api.get<Booking>(`/bookings/${id}`),
  getBookingByToken: (token: string) =>
    api.get<Booking>(`/bookings/token/${token}`),
  cancelBooking: (id: number) =>
    api.post<Booking>(`/bookings/${id}/cancel`),
};

// ----- Payments -----
export const paymentsApi = {
  initPayment: (bookingId: number, amount: number, channel: string) =>
    api.post<Payment>('/payments', { bookingId, amount, channel }),
  getPayment: (id: number) => api.get<Payment>(`/payments/${id}`),
  handlePaymentWebhook: (payload: any) =>
    api.post('/payments/webhook', payload),
};

// ----- Notifications -----
export const notificationsApi = {
  listNotificationsByBooking: (bookingId: number) =>
    api.get<Notification[]>(`/bookings/${bookingId}/notifications`),
  sendNotification: (data: { bookingId?: number; contactInfo: string; type: string; message: string }) =>
    api.post<Notification>('/notifications', data),
};

// Settings
export const settingsApi = {
  getSettings: () => api.get('/companySettings'),
}

export default api;
