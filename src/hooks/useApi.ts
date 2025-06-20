import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, routesApi, tripsApi, busesApi, seatsApi, paymentsApi, notificationsApi, Trip } from '@/services/api';
import { AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { PaystackParams, payWithPaystack } from '@/services/paystackService';
import { useBookingStore } from '@/stores/bookingStore';
import { toast } from "@/components/ui/sonner";

function extract<T>(res: AxiosResponse<{ data: T }>): T{
  return res.data.data;
}
// Routes
export const useListRoutes = () => useQuery({
  queryKey: ['routes'],
  queryFn: routesApi.getFeaturedRoutes,
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

export const useGetBooking = (bookingId: string) => useQuery({
  queryKey: ['booking', bookingId],
  queryFn: () => bookingsApi.getBooking(Number(bookingId)),
  enabled: !!bookingId,
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
  const QueryClient = useQueryClient();

  return useMutation<{ success: boolean, ticketUrl?: string }, Error, PaystackParams >( {
    mutationFn: payWithPaystack,
    onSuccess: (data) => {
      if (data.success) {
        QueryClient.invalidateQueries({
          queryKey: ['payments'],
          exact: true,
        });

        if (data.ticketUrl) {
          toast.success("Ticket is downloading...")

          // Programatic download
          const link = document.createElement('a');
          // link.href = data.ticketUrl;
          // link.download = '';
          window.open(data.ticketUrl, "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },

    onError: (err) => {
      console.error(err);
      
    }
  })
}

// Notifications
export const useSendNotification = () => useMutation({
  mutationFn: (data: { bookingId?: number; contactInfo: string; type: string; message: string }) =>
    notificationsApi.sendNotification(data),
});
