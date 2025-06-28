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
import { api } from '@/services/api';

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

// Form schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "manager", "support", "finance", "driver"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const AdminUsers = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds “the array to display”
  // —————————————————————————————————————————————
  const [usersData, setUsersData] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "view">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  // 4) Effect: “if mock‐flag is on, ignore API and always load initialUsers;
  //           otherwise, once loading finishes, copy/format the API rows”
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
  // 5) React Hook Form
  // —————————————————————————————————————————————
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "support",
    },
  });

  // —————————————————————————————————————————————
  // 6) Handle “create”
  // —————————————————————————————————————————————
  const handleCreateUser = () => {
    setModalType("create");
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "support",
    });
    setOpenModal(true);
  };

  const onSubmit = (values: UserFormValues) => {
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
          },
        }
      );
    }
  };

  // —————————————————————————————————————————————
  // 7) Handle “edit”
  // —————————————————————————————————————————————
  const handleEditUser = (user: User) => {
    setModalType("edit");
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as any,
    });
    setOpenModal(true);
  };

  const onEditSubmit = (values: UserFormValues) => {
    if (!selectedUser) return;
    if (USE_MOCK_USERS) {
      setLoading(true);
      setTimeout(() => {
        setUsersData((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  name: values.name,
                  email: values.email,
                  role: values.role,
                  lastLogin: u.lastLogin,
                  createdAt: u.createdAt,
                  status: u.status,
                  password: u.password,
                  logs: u.logs,
                }
              : u
          )
        );
        setLoading(false);
        setOpenModal(false);
        toast.success("User updated successfully (mock)!");
      }, 1000);
    } else {
      updateUserMutation.mutate(
        {
          id: selectedUser.id,
          userData: {
            name: values.name,
            email: values.email,
            role: values.role,
            status: selectedUser.status,
            lastLogin: selectedUser.lastLogin!,
            password: selectedUser.password,
            logs: selectedUser.logs,
          },
        },
        {
          onSuccess: () => {
            setOpenModal(false);
            form.reset();
            setSelectedUser(null);
          },
        }
      );
    }
  };

  // —————————————————————————————————————————————
  // 8) Handle “view”
  // —————————————————————————————————————————————
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  // —————————————————————————————————————————————
  // 9) Handle “delete”
  // —————————————————————————————————————————————
  const handleDeleteUser = (userId: string) => {
    if (USE_MOCK_USERS) {
      setIsDeleting(true);
      setTimeout(() => {
        setUsersData((prev) => prev.filter((u) => u.id !== userId));
        setIsDeleting(false);
        toast.success("User deleted successfully (mock)!");
      }, 500);
    } else {
      deleteUserMutation.mutate(userId);
    }
  };

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
      <Button variant="ghost" size="icon" onClick={() => handleEditUser(u)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteUser(u.id)}
        disabled={deleteUserMutation.isPending || isDeleting}
      >
        <Trash className="h-4 w-4" />
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
        description="Add or modify user details."
        open={openModal}
        onOpenChange={setOpenModal}
        loading={loading || createUserMutation.isPending || updateUserMutation.isPending}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      // disabled={modalType === "edit"} Disable in edit mode
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      {/* <SelectItem value="driver">Driver</SelectItem> */}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || createUserMutation.isPending || updateUserMutation.isPending}
              >
                {loading || createUserMutation.isPending || updateUserMutation.isPending
                  ? "Processing..."
                  : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </FormModal>

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
