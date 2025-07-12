import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService, User, Route, Bus, Trip, Booking, Payment, DashboardStats, SystemSettingsResponse, Notification } from '../services/adminApi';
import { toast } from '@/components/ui/sonner';

// Query keys
export const ADMIN_QUERY_KEYS = {
  dashboard: ['admin', 'dashboard'],
  users: ['admin', 'users'],
  routes: ['admin', 'routes'],
  buses: ['admin', 'buses'],
  trips: ['admin', 'trips'],
  bookings: ['admin', 'bookings'],
  payments: ['admin', 'payments'],
  logs: ['admin', 'logs'],
  notifications: ['admin', 'notifications'],
  settings: ['admin', 'settings'],
};

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard,
    queryFn: async () => {
      const response = await adminApiService.getDashboardStats();
      console.log("Dashboard stats:", response);      
      return response.data;
    },
  });
};

// User hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users,
    queryFn: async () => {
      const response = await adminApiService.getUsers();
      console.log('Users:', response.data);
      
      return response.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt'>) => 
      adminApiService.createUser(userData),
         
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      console.log('User created:', response.data);
      toast.success('User created successfully');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      adminApiService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      toast.success('User updated successfully');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      toast.success('User deleted successfully');
    },
  });
};

// Route hooks
export const useRoutes = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.routes,
    queryFn: async () => {
      const response = await adminApiService.getRoutes();
      console.log(response.data);

      return response.data.data;
    },
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (routeData: Omit<Route, 'id'>) => 
      adminApiService.createRoute(routeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.routes });
      toast.success('Route created successfully');
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, routeData }: { id: string; routeData: Partial<Route> }) =>
      adminApiService.updateRoute(id, routeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.routes });
      toast.success('Route updated successfully');
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.routes });
      toast.success('Route deleted successfully');
    },
  });
};

// Bus hooks
export const useBuses = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.buses,
    queryFn: async () => {
      const response = await adminApiService.getBuses();      
      return response.data.data;
    },
  });
};

export const useCreateBus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (busData: Omit<Bus, 'id'>) => 
      adminApiService.createBus(busData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.buses });
      toast.success('Bus created successfully');
    },
  });
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, busData }: { id: string; busData: Partial<Bus> }) =>
      adminApiService.updateBus(id, busData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.buses });
      toast.success('Bus updated successfully');
    },
  });
};

export const useDeleteBus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.deleteBus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.buses });
      toast.success('Bus deleted successfully');
    },
  });
};

// Trip hooks
export const useTrips = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.trips,
    queryFn: async () => {
      const response = await adminApiService.getTrips();
      console.log(response.data.data);
      
      return response.data.data;
    },
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tripData: Omit<Trip, 'id' | 'availableSeats'>) => 
      adminApiService.createTrip(tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.trips });
      toast.success('Trip created successfully');
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, tripData }: { id: string; tripData: Partial<Trip> }) =>
      adminApiService.updateTrip(id, tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.trips });
      toast.success('Trip updated successfully');
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.trips });
      toast.success('Trip deleted successfully');
    },
  });
};

// Booking hooks
export const useBookings = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.bookings,
    queryFn: async () => {
      const response = await adminApiService.getBookings();
      console.log('booking response:', response.data.data)
      return response.data.data;
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string; bookingData: Partial<Booking> }) =>
      adminApiService.updateBooking(id, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.bookings });
      toast.success('Booking updated successfully');
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.bookings });
      toast.success('Booking deleted successfully');
    },
  });
};

// Payment hooks
export const usePayments = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.payments,
    queryFn: async () => {
      const response = await adminApiService.getPayments();
      console.log('Payment Log:', response)
      return response.data;
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApiService.processPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.payments });
      toast.success('Payment processed successfully');
    },
  });
};


// Logs hooks
export const useLogs = (type?: 'booking' | 'admin') => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.logs, type],
    queryFn: async () => {
      const response = await adminApiService.getLogs(type);
      return response.data;
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.notifications,
    queryFn: async () => {
      const response = await adminApiService.getNotifications();
      return response.data;
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationData: Omit<Notification, 'id' | 'sentAt' | 'status'>) => 
      adminApiService.createNotification(notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.notifications });
      toast.success('Notification created successfully');
    },
  });
};

// Settings hooks
export const useSettings = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings,
    queryFn: async () => {
      const response = await adminApiService.getSettings();
      console.log('Settings data:', response)
      return response.data.data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ( { id, settings }: { id: number, settings: Partial<SystemSettingsResponse> }) => 
      adminApiService.updateSettings(id, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings });
      toast.success('Settings updated successfully');
    },
  });
};

export const useCreateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Omit<SystemSettingsResponse, 'id'>) =>
      adminApiService.createSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings });
      toast.success('Settings created successfully');
    },
  });
};


export const useDeleteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApiService.deleteSettings(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings });
      toast.success('Settings deleted successfully');
    },
  });
};

