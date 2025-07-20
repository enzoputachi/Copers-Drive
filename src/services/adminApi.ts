import axios from 'axios';
import { toast } from '@/components/ui/sonner';
// Create an admin axios instance with admin-specific config

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // 'https://booking-api-tuso.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin token
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for admin-specific error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle admin-specific errors
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      return Promise.reject(error);
    }
    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

// =================== ENUMS ===================
export type BookingStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type SeatStatus    = 'AVAILABLE' | 'BOOKED' | 'RESERVED' | "UNAVAILABLE";
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type Role          = 'ADMIN' | string;
export type TripStatus    = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

// =================== USER ===================
export interface User {
  id: string;              // uuid
  name: string;
  email: string;
  password: string;
  status: string;          // e.g. 'active'
  lastLogin: string | null; // ISO date string or null
  createdAt: string;       // ISO date string
  role: Role;
  logs: AdminActivityLog[] | string; 
}

// =================== ROUTE ===================
export interface Route {
  id: number;
  origin: string;
  destination: string;
  distanceKm: number;
  isActive: boolean;
  trips: Trip[];
}

// =================== BUS ===================
export interface Bus {
  id: number;
  plateNo: string;
  busType: string;
  capacity: number;
  seatsPerRow: number;
  isActive: boolean;
  trips: Trip[];
}

// =================== TRIP ===================
export interface Trip {
  id: number;
  departTime: string; // ISO date
  arriveTime: string; // ISO date
  busId: number;
  bus: Bus;
  routeId: number;
  route: Route;
  price: number;
  status: TripStatus;
  seats: Seat[];
  availableSeats: string;
  bookings: Booking[];
}

// =================== SEAT ===================
export interface Seat {
  id: number;
  seatNo: string;
  status: SeatStatus;
  tripId: number;
  trip: Trip;
  reservedAt: string | null; // ISO date or null
  booking: Booking | null;
}

// =================== BOOKING ===================
export interface Booking {
  id: number;
  tripId: number;
  trip: Trip;
  seatId: number;
  seat: Seat;
  passengerTitle: string | null;
  passengerName: string;
  passengerAge: number | null;
  nextOfKinName: string;
  nextOfKinPhone: string;
  email: string;
  mobile: string;
  contactHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  sessionId: string | null;
  referrer: string | null;
  deviceFingerprint: string | null;
  bookingToken: string;
  status: BookingStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  payment: Payment | null;
  logs: BookingLog[];
  Notifications: Notification[];
}

// =================== PAYMENT ===================
export interface Payment {
  id: number;
  bookingId: number;
  booking: Booking;
  paystackRef: string | null;
  amount: number;
  channel: string | null;
  currency: string; // defaults to 'NGN'
  provider: string; // defaults to 'Paystack'
  status: PaymentStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  customerId: string | null;
  paidAt: string | null; 
  authorization: any | null; // JSON
}

// =================== BOOKING LOG ===================
export interface BookingLog {
  id: number;
  bookingId: number;
  booking: Booking;
  action: string;
  timestamp: string; // ISO date
  metadata: any | null;
}

// =================== NOTIFICATION ===================
export interface Notification {
  id: number;
  contactInfo: string;
  type: 'email' | 'sms'; // e.g. "EMAIL", "SMS"
  message: string;
  sentAt: string; // ISO date
  // bookingId: number | null;
  // booking: Booking | null;
  status: 'delivered' | 'pending' | 'failed';
}

// =================== ADMIN ACTIVITY LOG ===================
export interface AdminActivityLog {
  id: number;
  userId: string;
  user: User;
  action: string;
  metadata: any | null;
  timestamp: string; // ISO date
}

// =================== DASHBOARD STATS===================
export interface DashboardStats {
  totalBookings: number;
  activeTrips: number;
  pendingBookings: number;
  monthlyRevenue: number;
  tripGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export interface DashboardResponse {
  data: DashboardStats;
}

// =================== SYSTEM LOG ===================
export interface SystemLog {
  id: string;
  type: 'booking' | 'admin';
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// =================== NOTIFICATION ===================
// export interface Notification {
//   id: number;
//   type: 'email' | 'sms';
//   contactInfo: string;
//   message: string;
//   sentAt: string;
//   status: 'delivered' | 'pending' | 'failed';
// }

// =================== SYATEM SETTINGS ===================
export interface SystemSettings {
  // Prisma schema fields
  id: number;
  companyName: string;
  supportEmail: string;
  supportPhone?: string | null;
  websiteUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  whatsAppUrl?: string;
  whatsAppGroupUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;

  // Your original system settings fields
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  seatHoldMinutes: number;
  maxSeatsPerBooking: number;
  bookingDeadlineHours: number;
  paystackEnabled: boolean;
  paystackPublicKey: string;
  bankTransferEnabled: boolean;
  bookingEmailsEnabled: boolean;
  paymentEmailsEnabled: boolean;
  reminderSmsEnabled: boolean;
  reminderHours: number;
}

export interface SystemSettingsResponse {
  data: SystemSettings;
}



// API functions
export const adminApiService = {
  // Dashboard
  getDashboardStats: () => adminApi.get<DashboardResponse>('/dashboardStats'),

  // Users
  getUsers: () => adminApi.get<User[]>('/users'),
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => adminApi.post<User>('/users', userData),
  updateUser: (id: string, userData: Partial<User>) => adminApi.patch<User>(`/users/${id}`, userData),
  deleteUser: (id: string) => adminApi.delete(`/users/${id}`),

  // Routes
  getRoutes: () => adminApi.get<{ status: string, data: Route[] }>('/routes'),  // ✅
  createRoute: (routeData: Omit<Route, 'id'>) => adminApi.post<Route>('/routes', routeData),
  updateRoute: (id: string, routeData: Partial<Route>) => adminApi.patch<Route>(`/routes/${id}`, routeData),
  deleteRoute: (id: string) => adminApi.delete(`/routes/${id}`),

  // Buses
  getBuses: () => adminApi.get<{ status: string; data: Bus[] }>('/buses'), // ✅
  createBus: (busData: Omit<Bus, 'id'>) => adminApi.post<Bus>('/buses', busData), // ✅
  updateBus: (id: string, busData: Partial<Bus>) => adminApi.patch<Bus>(`/buses/${id}`, busData),
  deleteBus: (id: string) => adminApi.delete(`/buses/${id}`),

  // Trips
  getTrips: () => adminApi.get<{ status: string, data: Trip[] }>('/trips'),
  createTrip: (tripData: Omit<Trip, 'id' | 'availableSeats'>) => adminApi.post<Trip>('/trips', tripData),
  updateTrip: (id: string, tripData: Partial<Trip>) => adminApi.patch<Trip>(`/trips/${id}`, tripData),
  deleteTrip: (id: string) => adminApi.delete(`/trips/${id}`),

  // Seats
  updateSeatStatus: (payload: { seatIds: number[]; data: Partial<Pick<Seat, 'status' | 'reservedAt'>>;}) => 
    adminApi.patch<{count: number}>(`/seats/update`, payload),

  // Bookings
  getBookings: () => adminApi.get<{ data: Booking[], status: string }>('/bookings'),
  updateBooking: (id: string, bookingData: Partial<Booking>) => adminApi.patch<Booking>(`/bookings/${id}`, bookingData),
  deleteBooking: (id: string) => adminApi.delete(`/bookings/${id}`),

  // Payments
  getPayments: () => adminApi.get<Payment[]>('/payments'),
  processPayment: (id: string) => adminApi.post(`/payments/${id}/process`),

  // Logs
  getLogs: (type?: 'booking' | 'admin') => {
    const params = type ? { type } : {};
    return adminApi.get<SystemLog[]>('/logs', { params });
  },

  // Notifications
  getNotifications: () => adminApi.get<Notification[]>('/notifications'),
  createNotification: (notificationData: Omit<Notification, 'id' | 'sentAt' | 'status'>) => 
    adminApi.post<Notification>('/notifications', notificationData),

  // Settings
  // Settings
  getSettings: () => adminApi.get<SystemSettings>('/companySettings'),
  createSettings: (settings: Omit<SystemSettingsResponse, 'id' | 'createdAt' | 'updatedAt'>) =>
    adminApi.post<SystemSettings>('/companySettings', settings),
  updateSettings: (id: number, settings: Partial<SystemSettingsResponse>) =>
    adminApi.patch<SystemSettingsResponse>(`/companySettings/${id}`, settings),
  deleteSettings: (id: number) =>
    adminApi.delete(`/companySettings/${id}`),

};


export default adminApiService;