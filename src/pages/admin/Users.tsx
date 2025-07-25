import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash, Eye } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useAdminQueries";
import { User } from "@/services/adminApi";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";

// —————————————————————————————————————————————
// 1) Mock user data (IDs as strings, including all User fields)
// —————————————————————————————————————————————
const initialUsers: User[] = [
  {
    id: "1",
    email: "admin@Corpers Drive.ng",
    name: "Admin User",
    role: "admin",
    lastLogin: "2023-05-20T10:30:00Z",
    createdAt: "2023-04-01T09:00:00Z",
    status: "active",
    password: "",           // placeholder for required field
    logs: [],               // placeholder for required field
  },
  {
    id: "2",
    email: "manager@Corpers Drive.ng",
    name: "Operations Manager",
    role: "manager",
    lastLogin: "2023-05-19T14:20:00Z",
    createdAt: "2023-04-02T11:15:00Z",
    status: "active",
    password: "",
    logs: [],
  },
  {
    id: "3",
    email: "support@Corpers Drive.ng",
    name: "Support Staff",
    role: "support",
    lastLogin: "2023-05-18T09:15:00Z",
    createdAt: "2023-04-03T08:45:00Z",
    status: "active",
    password: "",
    logs: [],
  },
  {
    id: "4",
    email: "finance@Corpers Drive.ng",
    name: "Finance Admin",
    role: "finance",
    lastLogin: "2023-05-17T16:45:00Z",
    createdAt: "2023-04-04T10:30:00Z",
    status: "active",
    password: "",
    logs: [],
  },
  {
    id: "5",
    email: "driver@Corpers Drive.ng",
    name: "Driver User",
    role: "driver",
    lastLogin: "2023-05-16T08:00:00Z",
    createdAt: "2023-04-05T12:00:00Z",
    status: "active",
    password: "",
    logs: [],
  },
];

// Toggle to force‐use mock data instead of API
const USE_MOCK_USERS = false;

// —————————————————————————————————————————————
// FIXED: Separate schemas for create and edit
// —————————————————————————————————————————————
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "manager", "support", "finance", "driver"]),
});

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // Password is optional in edit mode
  password: z.string().optional().refine((val) => {
    // If password is provided, it must be at least 6 characters
    if (val && val.length > 0) {
      return val.length >= 6;
    }
    return true;
  }, "Password must be at least 6 characters if provided"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "manager", "support", "finance", "driver"]).optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;

const AdminUsers = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds "the array to display"
  // —————————————————————————————————————————————
  const [usersData, setUsersData] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "view">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add delete dialogue
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // —————————————————————————————————————————————
  // 3) React Query hooks
  // —————————————————————————————————————————————
  const { data: apiUsersRaw = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const apiUsers = apiUsersRaw.data

  console.log("API Users:", apiUsers);
  
  // —————————————————————————————————————————————
  // 4) Effect: "if mock‐flag is on, ignore API and always load initialUsers;
  //           otherwise, once loading finishes, copy/format the API rows"
  // —————————————————————————————————————————————
  useEffect(() => {
    if (USE_MOCK_USERS) {
      setUsersData(initialUsers);
    } else if (!isLoading) {
      if (Array.isArray(apiUsers)) {
        const formatted = apiUsers.map((u: User) => ({
          ...u,
          id: String(u.id),
        }));
        setUsersData(formatted);
      } 
    }
  }, [apiUsers, isLoading]);

  // —————————————————————————————————————————————
  // FIXED: Dynamic form schema based on modal type
  // —————————————————————————————————————————————
  const form = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(modalType === "create" ? createUserSchema : editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "admin",
    },
  });

  // —————————————————————————————————————————————
  // 6) Handle "create"
  // —————————————————————————————————————————————
  const handleCreateUser = () => {
    setModalType("create");
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
    setOpenModal(true);
  };

  const onSubmit = (values: CreateUserFormValues) => {
    if (USE_MOCK_USERS) {
      setLoading(true);
      setTimeout(() => {
        const nowIso = new Date().toISOString();
        const newUser: User = {
          id: Date.now().toString(),
          name: values.name,
          email: values.email,
          role: values.role,
          lastLogin: nowIso,
          createdAt: nowIso,
          status: "active",
          password: values.password, // placeholder
          logs: [],     // placeholder
        };
        setUsersData((prev) => [...prev, newUser]);
        setLoading(false);
        setOpenModal(false);
        toast.success("User created successfully (mock)!");
        form.reset();
      }, 1000);
    } else {
      createUserMutation.mutate(
        {
          name: values.name,
          email: values.email,
          role: values.role,
          status: "active",
          lastLogin: new Date().toISOString(),
          password: values.password,
          logs: [],
        },
        {
          onSuccess: () => {
            setOpenModal(false);
            form.reset();
            toast.success("User created successfully!");
          },
        }
      );
    }
  };

  // —————————————————————————————————————————————
  // 7) Handle "edit"
  // —————————————————————————————————————————————
  const handleEditUser = (user: User) => {
    setModalType("edit");
    setSelectedUser(user);

     const mappedRole = user.role === 'ADMIN' ? 'admin' : user.role;

    form.reset({
      name: user.name,
      email: user.email,
      password: "", // Always start with empty password in edit mode
      role: mappedRole as any,
    });
    setOpenModal(true);
  };

  // —————————————————————————————————————————————
  // FIXED: Improved edit handler with better UX
  // —————————————————————————————————————————————
  const onEditSubmit = (values: EditUserFormValues) => {
    if (!selectedUser) return;
    
    // Build changes object with better validation
    const changes: Partial<User> = {};
    let hasChanges = false;
    const changesList: string[] = [];
    
    // Check name change
    if (values.name.trim() !== selectedUser.name.trim()) {
      changes.name = values.name.trim();
      hasChanges = true;
      changesList.push('name');
    }
    
    // Check email change
    if (values.email.trim().toLowerCase() !== selectedUser.email.trim().toLowerCase()) {
      changes.email = values.email.trim();
      hasChanges = true;
      changesList.push('email');
    }
    
    // Check role change
     const currentRole = selectedUser.role === 'ADMIN' ? 'admin' : selectedUser.role;
    if (values.role !== currentRole) {
      changes.role = values.role;
      hasChanges = true;
      changesList.push('role');
    }
    
    // Only include password if it's provided and not empty
    if (values.password && values.password.trim() !== '') {
      changes.password = values.password;
      hasChanges = true;
      changesList.push('password');
    }
    
    // If no changes, show friendly message
    if (!hasChanges) {
      toast.info("No changes detected. User information remains the same.");
      setOpenModal(false);
      return;
    }
    
    // Show clear confirmation with security warning for password changes
    const hasPasswordChange = changesList.includes('password');
    const confirmMessage = hasPasswordChange 
      ? `⚠️ SECURITY WARNING: You are about to change the password for ${selectedUser.name}.\n\nChanges: ${changesList.join(', ')}\n\nThis will log them out of all sessions. Continue?`
      : `You are about to update: ${changesList.join(', ')} for ${selectedUser.name}.\n\nContinue?`;
    
    const confirmed = window.confirm(confirmMessage);
    
    if (!confirmed) return;
    
    if (USE_MOCK_USERS) {
      setLoading(true);
      setTimeout(() => {
        setUsersData((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? { ...u, ...changes }
              : u
          )
        );
        setLoading(false);
        setOpenModal(false);
        
        // Different success messages
        const successMessage = hasPasswordChange 
          ? `User updated successfully! Password changed for ${selectedUser.name}.`
          : `User updated successfully! Changed: ${changesList.join(', ')}`;
        
        toast.success(successMessage);
        form.reset();
        setSelectedUser(null);
      }, 1000);
    } else {
      updateUserMutation.mutate(
        {
          id: selectedUser.id,
          userData: {
            ...changes,
            status: selectedUser.status,
            lastLogin: selectedUser.lastLogin!,
            logs: selectedUser.logs,
          },
        },
        {
          onSuccess: () => {
            setOpenModal(false);
            form.reset();
            setSelectedUser(null);
            
            const successMessage = hasPasswordChange 
              ? `User updated successfully! Password changed for ${selectedUser.name}.`
              : `User updated successfully! Changed: ${changesList.join(', ')}`;
              
            toast.success(successMessage);
          },
        }
      );
    }
  };

  // —————————————————————————————————————————————
  // 8) Handle "view"
  // —————————————————————————————————————————————
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  // —————————————————————————————————————————————
  // 9) Handle "delete"
  // —————————————————————————————————————————————

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setIsDeleteDialogOpen(false);
    setIsDeleting(true);
    if (USE_MOCK_USERS) {
      setIsDeleting(true);
      setTimeout(() => {
        setUsersData((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setIsDeleting(false);
        toast.success("User deleted successfully (mock)!");
      }, 500);
    } else {
      deleteUserMutation.mutate(userToDelete.id, { onSettled: () => setIsDeleting(false)});
      // console.log("User Id:", userId)
    }
  }

  // —————————————————————————————————————————————
  // 10) Loading/Error states (only in API mode)
  // —————————————————————————————————————————————
  if (!USE_MOCK_USERS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_USERS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load users. Please try again.</p>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 11) Define columns & actions for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    {
      key: "role",
      title: "Role",
      render: (u: User) => <span className="capitalize">{u.role}</span>,
    },
    {
      key: "lastLogin",
      title: "Last Login",
      render: (u: User) => (
        <span>
          {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
        </span>
      ),
    },
  ];

  const actions = (u: User) => (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="icon" onClick={() => handleViewUser(u)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleEditUser(u)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={() => confirmDeleteUser(u)}
        disabled={deleteUserMutation.isPending || isDeleting}
      >
        <Trash className="h-4 w-4 " />
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>User Management | Corpers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={usersData}
        keyExtractor={(item) => item.id}
        actions={actions}
      />

      {/* Create/Edit User Modal */}
      <FormModal
        title={modalType === "create" ? "Create User" : "Edit User"}
        description={
          modalType === "create" 
            ? "Add a new user to the system." 
            : "Modify user details. Only changed fields will be updated."
        }
        open={openModal}
        onOpenChange={setOpenModal}
        loading={
          loading ||
          createUserMutation.isPending ||
          updateUserMutation.isPending
        }
      >
        <Form {...form}>
          <form
            onSubmit={
              modalType === "create"
                ? form.handleSubmit(onSubmit)
                : form.handleSubmit(onEditSubmit)
            }
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* FIXED: Better password field with clear messaging */}
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    {modalType === "create" && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    {modalType === "edit" && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (optional - leave blank to keep current password)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        modalType === "edit"
                          ? "Enter new password or leave blank"
                          : "Password (required)"
                      }
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                  {modalType === "edit" && field.value && (
                    <p className="text-sm text-amber-600">
                      ⚠️ Password will be changed
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      {/* <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem> */}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    createUserMutation.isPending ||
                    updateUserMutation.isPending
                  }
                >
                  {loading ||
                  createUserMutation.isPending ||
                  updateUserMutation.isPending
                    ? "Processing..."
                    : modalType === "create" ? "Create User" : "Update User"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </FormModal>

      <DeleteConfirmation
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />

      {/* User Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Name</p>
                <p>{selectedUser.name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="font-medium">Role</p>
                <p className="capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="capitalize">{selectedUser.status}</p>
              </div>
              <div>
                <p className="font-medium">Created</p>
                <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Last Login</p>
                <p>
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;