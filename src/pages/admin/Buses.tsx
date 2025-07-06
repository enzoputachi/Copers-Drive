import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import BusForm from "@/components/admin/forms/BusForm";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { toast } from "sonner";
import {
  useBuses,
  useCreateBus,
  useUpdateBus,
  useDeleteBus,
} from "@/hooks/useAdminQueries";

// —————————————————————————————————————————————
// 1) Mock buses data (IDs as strings!)
// —————————————————————————————————————————————
const initialBuses = [
  {
    id: "1",
    plateNo: "ABC-123XY",
    capacity: 50,
    seatsPerRow: 4,
    isActive: true,
    busType: "Coach",
  },
  {
    id: "2",
    plateNo: "DEF-456XY",
    capacity: 20,
    seatsPerRow: 4,
    isActive: true,
    busType: "mini Bus",
  },
  {
    id: "3",
    plateNo: "GHI-789XY",
    capacity: 50,
    seatsPerRow: 4,
    isActive: true,
    busType: "Coach",
  },
  {
    id: "4",
    plateNo: "JKL-012XY",
    capacity: 50,
    seatsPerRow: 4,
    isActive: false,
    busType: "Coach",
  },
  {
    id: "5",
    plateNo: "MNO-345XY",
    capacity: 80,
    seatsPerRow: 5,
    isActive: true,
    busType: "Double Decker",
  },
];

// Toggle to force‐use mock data instead of API
const USE_MOCK_BUSES = false;

const AdminBuses = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds “the array to display”
  // —————————————————————————————————————————————
  const [busesData, setBusesData] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // —————————————————————————————————————————————
  // 3) React Query hooks
  // —————————————————————————————————————————————
  const { data: buses = [], isLoading, error } = useBuses();
  const createBusMutation = useCreateBus();
  const updateBusMutation = useUpdateBus();
  const deleteBusMutation = useDeleteBus();

  // —————————————————————————————————————————————
  // 4) Effect: “if mock‐flag is on, ignore API and always load initialBuses;
  //           otherwise, once loading finishes, copy/format the API rows”
  // —————————————————————————————————————————————
  useEffect(() => {
  if (USE_MOCK_BUSES) {
    setBusesData(initialBuses);
    return;
  }
  

  if (!isLoading && Array.isArray(buses)) {
    // Format the buses from the API
    const formatted = buses.map((bus: any) => ({
      ...bus,
      id: String(bus.id),
    }));

    console.log("Formated buses:", buses);
    

    // Prevent unnecessary state updates that can cause re-renders
    // const currentIds = busesData.map((b) => b.id).join(",");
    // const nextIds = formatted.map((b) => b.id).join(",");

    setBusesData(formatted);
  }
}, [buses, isLoading]);


  // —————————————————————————————————————————————
  // 5) Handle “create”:
  //     • If using mock: append to busesData
  //     • Otherwise call API mutation
  // —————————————————————————————————————————————
  const handleCreateBus = (data: any) => {
    if (USE_MOCK_BUSES) {
      setIsSubmitting(true);
      setTimeout(() => {
        const newBus = {
          id: Date.now().toString(),
          plateNo: data.plateNo,
          capacity: data.capacity,
          seatsPerRow: data.seatsPerRow,
          isActive: data.isActive,
          busType: data.busType,
        };
        setBusesData((prev) => [...prev, newBus]);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        toast.success("Bus created successfully (mock).");
      }, 500);
      return;
    }

    createBusMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  // —————————————————————————————————————————————
  // 6) Handle “edit”:
  //     • If mock: replace entry in busesData
  //     • Otherwise: call API update
  // —————————————————————————————————————————————
  const handleEditBus = (data: any) => {
    if (USE_MOCK_BUSES) {
      if (!currentBus) return;
      setIsSubmitting(true);
      setTimeout(() => {
        setBusesData((prev) =>
          prev.map((bus) =>
            bus.id === currentBus.id ? { ...bus, ...data } : bus
          )
        );
        setIsSubmitting(false);
        setIsEditModalOpen(false);
        toast.success("Bus updated successfully (mock).");
      }, 500);
      return;
    }

    if (!currentBus) return;
    updateBusMutation.mutate(
      { id: currentBus.id, busData: data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setCurrentBus(null);
        },
      }
    );
  };

  // —————————————————————————————————————————————
  // 7) Handle “delete”:
  //     • If mock: filter out from busesData
  //     • Otherwise: call API delete
  // —————————————————————————————————————————————
  const handleDeleteBus = () => {
    if (!currentBus) return;

    if (USE_MOCK_BUSES) {
      setIsDeleting(true);
      setTimeout(() => {
        setBusesData((prev) =>
          prev.filter((bus) => bus.id !== currentBus.id)
        );
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.success("Bus deleted successfully (mock).");
      }, 500);
      return;
    }

    deleteBusMutation.mutate(currentBus.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCurrentBus(null);
      },
    });
  };


  if (!USE_MOCK_BUSES && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_BUSES && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load buses. Please try again.</p>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 9) Define columns & actions for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { key: "plateNo", title: "Plate Number" },
    { key: "capacity", title: "Capacity" },
    { key: "seatsPerRow", title: "Seats Per Row" },
    {
      key: "isActive",
      title: "Status",
      render: (bus: any) => (
        <span className={bus.isActive ? "text-green-600" : "text-red-600"}>
          {bus.isActive ? "Active" : "Maintenance"}
        </span>
      ),
    },
    { key: "busType", title: "Bus Type" },
  ];

  const actions = (bus: any) => (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentBus(bus);
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
          setCurrentBus(bus);
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );

  // —————————————————————————————————————————————
  // 10) Render table + modals
  // —————————————————————————————————————————————
  return (
    <>
      <Helmet>
        <title>Bus Management | Corpers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bus Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Bus
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={busesData}
        keyExtractor={(item) => item.id}
        actions={actions}
      />

      {/* Create Bus Modal */}
      <FormModal
        title="Add New Bus"
        description="Enter the details of the new bus."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateBus}
      >
        <BusForm onSubmit={handleCreateBus} isSubmitting={isSubmitting}  onCancel={() => setIsCreateModalOpen(false)}/>
      </FormModal>

      {/* Edit Bus Modal */}
      <FormModal
        title="Edit Bus"
        description="Update the bus details."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditBus}
      >
        {currentBus && (
          <BusForm
            defaultValues={currentBus}
            onSubmit={handleEditBus}
            isSubmitting={isSubmitting}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        title="Delete Bus"
        description={`Are you sure you want to delete the bus ${currentBus?.plateNo}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteBus}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default AdminBuses;
