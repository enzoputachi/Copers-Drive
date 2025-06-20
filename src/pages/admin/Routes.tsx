import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import RouteForm from "@/components/admin/forms/RouteForm";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { toast } from "sonner";
import {
  useRoutes,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
} from "@/hooks/useAdminQueries";

// —————————————————————————————————————————————
// 1) Mock routes data (IDs as strings!)
// —————————————————————————————————————————————
const initialRoutes = [
  {
    id: "1",
    origin: "New York",
    destination: "Boston",
    distance: 346,
    duration: "4h 30m",
    isActive: true,
  },
  {
    id: "2",
    origin: "Los Angeles",
    destination: "San Francisco",
    distance: 615,
    duration: "6h 15m",
    isActive: true,
  },
  {
    id: "3",
    origin: "Chicago",
    destination: "Detroit",
    distance: 455,
    duration: "5h 5m",
    isActive: false,
  },
];

// Toggle to force‐use mock data instead of API
const USE_MOCK_ROUTES = false;

const AdminRoutes = () => {
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: routes = [], isLoading, error } = useRoutes();
  const createRouteMutation = useCreateRoute();
  const updateRouteMutation = useUpdateRoute();
  const deleteRouteMutation = useDeleteRoute();

  useEffect(() => {
    if (USE_MOCK_ROUTES) {
      setRoutesData(initialRoutes);
    } else if (!isLoading) {
      if (!isLoading && Array.isArray(routes)) {
        const formatted = routes.map((route: any) => ({
          ...route,
          id: String(route.id),
          distance: route.distanceKm, 
        }));
        setRoutesData(formatted);
      } 
    }
  }, [routes, isLoading]);

  const handleCreateRoute = (data: any) => {
    if (USE_MOCK_ROUTES) {
      setIsSubmitting(true);
      setTimeout(() => {
        const newRoute = {
          id: Date.now().toString(),
          ...data,
        };
        setRoutesData((prev) => [...prev, newRoute]);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        toast.success("Route created successfully (mock).");
      }, 500);
      return;
    }

    createRouteMutation.mutate(data, {
      onSuccess: () => setIsCreateModalOpen(false),
    });
  };

  const handleEditRoute = (data: any) => {
    if (USE_MOCK_ROUTES) {
      if (!currentRoute) return;
      setIsSubmitting(true);
      setTimeout(() => {
        setRoutesData((prev) =>
          prev.map((r) => (r.id === currentRoute.id ? { ...r, ...data } : r))
        );
        setIsSubmitting(false);
        setIsEditModalOpen(false);
        toast.success("Route updated successfully (mock).");
      }, 500);
      return;
    }

    if (!currentRoute) return;
    updateRouteMutation.mutate(
      { id: currentRoute.id, routeData: data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setCurrentRoute(null);
        },
      }
    );
  };

  const handleDeleteRoute = () => {
    if (!currentRoute) return;

    if (USE_MOCK_ROUTES) {
      setIsDeleting(true);
      setTimeout(() => {
        setRoutesData((prev) =>
          prev.filter((r) => r.id !== currentRoute.id)
        );
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.success("Route deleted successfully (mock).");
      }, 500);
      return;
    }

    deleteRouteMutation.mutate(currentRoute.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCurrentRoute(null);
      },
    });
  };

  if (!USE_MOCK_ROUTES && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_ROUTES && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load routes. Please try again.</p>
      </div>
    );
  }

  const columns = [
    { key: "origin", title: "Origin" },
    { key: "destination", title: "Destination" },
    { key: "distance", title: "Distance (km)" },
    { key: "duration", title: "Duration" },
    {
      key: "isActive",
      title: "Status",
      render: (route: any) => (
        <span className={route.isActive ? "text-green-600" : "text-red-600"}>
          {route.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = (route: any) => (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentRoute(route);
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
          setCurrentRoute(route);
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Route Management | Copers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Route Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Route
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={routesData}
        keyExtractor={(item) => item.id}
        actions={actions}
      />

      <FormModal
        title="Add New Route"
        description="Enter the details of the new route."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={() => {}}
      >
        <RouteForm onSubmit={handleCreateRoute} isSubmitting={isSubmitting} />
      </FormModal>

      <FormModal
        title="Edit Route"
        description="Update the route details."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={() => {}}
      >
        {currentRoute && (
          <RouteForm
            defaultValues={currentRoute}
            onSubmit={handleEditRoute}
            isSubmitting={isSubmitting}
          />
        )}
      </FormModal>

      <DeleteConfirmation
        title="Delete Route"
        description={`Are you sure you want to delete the route from ${currentRoute?.origin} to ${currentRoute?.destination}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRoute}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default AdminRoutes;
