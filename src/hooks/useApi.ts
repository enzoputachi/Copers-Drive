import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, routesApi, tripsApi, busesApi, seatsApi, paymentsApi, notificationsApi, Trip, settingsApi, retrieveBookingApi, confirmBookingApi } from '@/services/api';
import { AxiosResponse } from 'axios';
import { PaystackParams, payWithPaystack } from '@/services/paystackService';
import { useBookingStore } from '@/stores/bookingStore';
import { toast } from "@/components/ui/sonner";

function extract<T>(res: AxiosResponse<{ data: T }>): T{
  return res.data.data;
}
// Routes
export const useGetFeaturedRoutes = () => useQuery({
  queryKey: ['featuredRoutes'],
  queryFn: routesApi.getFeaturedRoutes,
});

export const useListRoutes = () => useQuery({
  queryKey: ['routes'],
  queryFn: routesApi.listRoutes,
});

export const useGetRoute = (routeId: number) => useQuery({
  queryKey: ['route', routeId],
  queryFn: () => routesApi.getRoute(routeId),
  enabled: !!routeId,
});

// Trips
// ========= STEP 1 ============ //
export const useSearchTripsByRoute = (params: { origin: string; destination: string; date: string }) => useQuery<Trip[], Error>({
  queryKey: ['searchTripsByRoute', params],
  queryFn: () => tripsApi.searchTrips(params).then(res => res.data.data.trips),
  enabled: !!params.origin && !!params.destination && !!params.date,
});

// ========= STEP 2 ============ //
export const useValidateTripDetails = (tripId: number) => useQuery({
  queryKey: ['trip', tripId],
  queryFn: () => tripsApi.validateTrip(tripId).then(res => res.data.data.seats),
  enabled: !!tripId,
});

// Buses
export const useGetBusDetails = (busId: number) => useQuery({
  queryKey: ['bus', busId],
  queryFn: () => busesApi.getBus(busId),
  enabled: !!busId,
});

// Seats
export const useListSeatsByTrip = (tripId: number) => useQuery({
  queryKey: ['seats', tripId],
  queryFn: () => seatsApi.listSeatsByTrip(tripId),
  enabled: !!tripId,
});

// ====== STEP 3 Bookings ============ //
export const useCreateBookingDraft = () => {
  const queryClient = useQueryClient();
  const setBookingDraftId = useBookingStore(state => state.setBookingDraftId)
  const setBookingToken = useBookingStore(state => state.setBookingToken)

  return useMutation({
    mutationFn: bookingsApi.createBookingDraft,
    onSuccess: (response) => {
      const id = response.data.data.id;
      const bookingToken = response.data.data.bookingToken;

      // store in zustand
      setBookingDraftId(id);
      setBookingToken(bookingToken);
      console.log("✅ createBookingDraft response:", response);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useGetBooking = (bookingToken?: string) => 
  useQuery({
  queryKey: ['booking', bookingToken],
  queryFn: () => bookingsApi.getBookingByToken(bookingToken).then(res => res.data.data),
  enabled: !!bookingToken,
});

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Payments
export const useInitPayment = () => useMutation({
  mutationFn: ({ bookingId, amount, channel }: { bookingId: number; amount: number; channel: string }) =>
  paymentsApi.initPayment(bookingId, amount, channel),
});

export const useGetPayment = (bookingId: number) => useQuery({
  queryKey: ['payment', bookingId],
  queryFn: () => paymentsApi.getPayment(bookingId),
  enabled: !!bookingId,
});

// PaystackPayment
export const usePaystackPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean, ticketUrl?: string }, Error, PaystackParams>({
    mutationFn: async (params: PaystackParams) => {
      const result = await payWithPaystack(params);
      
      // If payment failed or was cancelled, throw an error so React Query treats it as a failure
      if (!result.success) {
        if (result.cancelled) {
          throw new Error('Payment was cancelled');
        } else {
          throw new Error('');
        }
      }
      
      return result;
    },
    
    onSuccess: (data) => {
      // This will only run when payment is actually successful
      queryClient.invalidateQueries({
        queryKey: ['payments'],
        exact: true,
      });

      if (data.ticketUrl) {
        toast.success("Ticket is downloading...");

        // Programmatic download
        const link = document.createElement('a');
        link.href = data.ticketUrl;
        // Uncomment these if you want to force download instead of opening in new tab
        // link.download = '';
        // link.click();
        
        // Or open in new tab (current behavior)
        // window.open(data.ticketUrl, "_blank");
        
        document.body.appendChild(link);
        document.body.removeChild(link);
      }
    },

    onError: (error) => {
      console.error('Payment error:', error);
      
      // Don't show error toast for cancellations since we already show "cancelled" toast
      if (error.message !== 'Payment was cancelled') {
        toast.error(error.message || 'Payment failed. Please try again.');
      }
    }
  });
};

// Notifications
export const useSendNotification = () => useMutation({
  mutationFn: (data: { bookingId?: number; contactInfo: string; type: string; message: string }) =>
    notificationsApi.sendNotification(data),
});

// Settings
export const useSettings = () =>useQuery({
  queryKey: ['companySettings', ],
  queryFn: () => settingsApi.getSettings(),
})

// Retrieve Booking
export const useRetrieveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingToken, email }: { bookingToken: string; email: string }) => 
      retrieveBookingApi.getBooking(bookingToken, email).then(res => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data.id], data);
      console.log("Retrieved booking:", data);
    },
    onError: (error) => {
      console.error("Error retrieving booking:", error);
    }
  });
};


// confirm booking
export const useGetBookingByToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingToken }: { bookingToken: string }) => 
      confirmBookingApi.getBooking(bookingToken).then(res => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data.id], data);
      console.log("Retrieved booking:", data);
    },
    onError: (error) => {
      console.error("Error retrieving booking:", error);
    }
  });
};