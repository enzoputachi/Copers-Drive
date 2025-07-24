
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import TripForm from "@/components/admin/forms/TripForm";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useBuses, useCreateTrip, useDeleteTrip, useRoutes, useTrips, useUpdateTrip } from "@/hooks/useAdminQueries";

// Mock trips data
const initialTrips = [
  { 
    id: 1, 
    route: "Lagos to Abuja", 
    routeId: "1",
    departTime: "2023-05-25T08:00:00Z", 
    arriveTime: "2023-05-25T15:00:00Z", 
    bus: "ABC-123XY", 
    busId: "1",
    price: 15000,
    availableSeats: 28,
    status: "scheduled"
  },
  { 
    id: 2, 
    route: "Lagos to Ibadan", 
    routeId: "2",
    departTime: "2023-05-25T10:00:00Z", 
    arriveTime: "2023-05-25T12:30:00Z", 
    bus: "DEF-456XY", 
    busId: "2",
    price: 5000,
    availableSeats: 15,
    status: "completed"
  },
  { 
    id: 3, 
    route: "Abuja to Kaduna", 
    routeId: "3",
    departTime: "2023-05-26T09:00:00Z", 
    arriveTime: "2023-05-26T11:30:00Z", 
    bus: "GHI-789XY", 
    busId: "3",
    price: 6500,
    availableSeats: 30,
    status: "scheduled"
  },
  { 
    id: 4, 
    route: "Port Harcourt to Calabar", 
    routeId: "5",
    departTime: "2023-05-27T07:30:00Z", 
    arriveTime: "2023-05-27T11:00:00Z", 
    bus: "JKL-012XY", 
    busId: "4",
    price: 8000,
    availableSeats: 22,
    status: "canceled"
  },
];

// Toggle to force‐use mock data instead of API
const USE_MOCK_TRIPS = false;

const AdminTrips = () => {
  const [tripsData, setTripsData] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: trips = [], isLoading, error } = useTrips();
  const createTripMutation = useCreateTrip();
  const updateTripMutation = useUpdateTrip();
  const deleteTripMutation = useDeleteTrip();

  const { data: rawRoutes = [] } = useRoutes();
  const { data: rawBuses = [] } = useBuses();

  // Transform API data into the shape TripForm expects:
  const routes: { id: string; name: string }[] = rawRoutes.map(route => ({
    id: String(route.id),
    name: `${route.origin} to ${route.destination}`,
  }));

  const buses: { id: string; plateNo: string }[] = rawBuses.map(bus => ({
    id: String(bus.id),
    plateNo: bus.plateNo, // or bus.plateNo, depending on your API
  }));

    useEffect(() => {
    if (USE_MOCK_TRIPS) {
      setTripsData(initialTrips);
    } else if (!isLoading) {
      if (!isLoading && Array.isArray(trips)) {
        const formatted = trips.map((trip: any) => ({
          ...trip,
          id: String(trip.id),
          route: `${trip.route.origin} ➡️ ${trip.route.destination}`,
          bus: trip.bus.busType,
          busId: trip.bus.id,
          availableSeats: trip.availableSeatsCount,
        }));

        const isSame = JSON.stringify(tripsData) === JSON.stringify(formatted);
        if (!isSame) {
          setTripsData(formatted);
        }      } 
    }
  }, [trips, tripsData, isLoading]);

    // —————————————————————————————————————————————
  // 5) Handle “create”:
  //     • If using mock: append to tripsData
  //     • Otherwise call API mutation
  // —————————————————————————————————————————————
  const handleCreateTrip = (data: any) => {
    if (USE_MOCK_TRIPS) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would get route and bus details from API
        const routeInfo = { "1": "Lagos to Abuja", "2": "Lagos to Ibadan", "3": "Abuja to Kaduna", "4": "Lagos to Benin", "5": "Port Harcourt to Calabar" };
        const busInfo = { "1": "ABC-123XY", "2": "DEF-456XY", "3": "GHI-789XY", "4": "JKL-012XY", "5": "MNO-345XY" };
        
        const newTrip = {
          id: Date.now().toString(),
          route: routeInfo[data.routeId as keyof typeof routeInfo],
          bus: busInfo[data.busId as keyof typeof busInfo],
          ...data,
        };
        
        setTripsData([...trips, newTrip]);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        toast.success("Trip created successfully");
      }, 500);
      return;
    }

    createTripMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      }
    })
  };

  const handleEditTrip = (data: any) => {
    if (USE_MOCK_TRIPS) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would get route and bus details from API
        const routeInfo = { "1": "Lagos to Abuja", "2": "Lagos to Ibadan", "3": "Abuja to Kaduna", "4": "Lagos to Benin", "5": "Port Harcourt to Calabar" };
        const busInfo = { "1": "ABC-123XY", "2": "DEF-456XY", "3": "GHI-789XY", "4": "JKL-012XY", "5": "MNO-345XY" };
        
        const updatedTrips = trips.map(trip => {
          if (trip.id === currentTrip.id) {
            return {
              ...trip,
              ...data,
              route: routeInfo[data.routeId as keyof typeof routeInfo],
              bus: busInfo[data.busId as keyof typeof busInfo],
            };
          }
          return trip;
        });
        
        setTripsData(updatedTrips);
        setIsSubmitting(false);
        setIsEditModalOpen(false);
        toast.success("Trip updated successfully");
      }, 500);
      return;
    }

    console.log("trip update:", data);
    

    if (!currentTrip) return;
    updateTripMutation.mutate(
      { id: currentTrip.id, tripData: data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setCurrentTrip(null);
        }
      }
    )
  };

  const handleDeleteTrip = () => {
    if (!currentTrip) return;

    if(USE_MOCK_TRIPS) {
      if (!currentTrip) return;
    
      setIsDeleting(true);
      // Simulate API call
      setTimeout(() => {
        setTripsData((prev) =>
            prev.filter((trip) => trip.id !== currentTrip.id)
        );
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.success("Trip deleted successfully");
      }, 500);
      return;
    }

    deleteTripMutation.mutate(currentTrip.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCurrentTrip(null);
      },
    });
  };


   if (!USE_MOCK_TRIPS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_TRIPS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load trips. Please try again.</p>
      </div>
    );
  }

  const columns = [
    { key: "route", title: "Route" },
    { 
      key: "departTime", 
      title: "Departure",
      render: (trip: any) => new Date(trip.departTime).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      }),
    },
    { 
      key: "arriveTime", 
      title: "Arrival",
      render: (trip: any) => new Date(trip.arriveTime).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      })
    },
    { key: "bus", title: "Bus" },
    { 
      key: "price", 
      title: "Price",
      render: (trip: any) => `₦${trip.price.toLocaleString()}`
    },
    { key: "availableSeats", title: "Available Seats" },
    {
      key: "status",
      title: "Status",
      render: (trip: any) => (
        <span 
          className={`capitalize ${
            trip.status === "SCHEDULED" 
              ? "text-blue-600" 
              : trip.status === "COMPLETED" 
                ? "text-green-600" 
                : "text-red-600"
          }`}
        >
          {trip.status}
        </span>
      ),
    },
  ];

  const actions = (trip: any) => (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          setCurrentTrip(trip);
          setIsEditModalOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-destructive hover:text-destructive"
        onClick={() => {
          setCurrentTrip(trip);
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <Link to={`/admin/trips/${trip.id}/seats`}>
        <Button variant="outline" size="sm">
          View Seats
        </Button>
      </Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Trip Management | Corpers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Trip Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Trip
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tripsData}
        keyExtractor={(item) => item.id}
        actions={actions}
      />

      {/* Create Trip Modal */}
      <FormModal
        title="Add New Trip"
        description="Enter the details of the new trip."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={() => {}}
      >
        <TripForm 
          onSubmit={handleCreateTrip}
          isSubmitting={isSubmitting}
          routes={routes}
          buses={buses}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Edit Trip Modal */}
      <FormModal
        title="Edit Trip"
        description="Update the trip details."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={() => {}}
      >
        {currentTrip && (
          <TripForm 
            defaultValues={{
              routeId: String(currentTrip.routeId),
              busId: String(currentTrip.busId),
              departTime: currentTrip.departTime,
              arriveTime: currentTrip.arriveTime,
              price: currentTrip.price,
              // availableSeats: currentTrip.availableSeats,
              status: currentTrip.status?.toLowerCase(),
            }}

            onSubmit={handleEditTrip}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
            routes={routes}
            buses={buses}
          />
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        title="Delete Trip"
        description={`Are you sure you want to delete the trip ${currentTrip?.route} scheduled on ${currentTrip ? new Date(currentTrip.departTime).toLocaleDateString() : ''}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTrip}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default AdminTrips;
