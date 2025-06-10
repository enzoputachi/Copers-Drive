
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { toast } from "@/components/ui/sonner";

// Mock roles data
const roles = [
  { 
    id: "1", 
    name: "Admin", 
    description: "Full system access",
    usersCount: 2,
    permissions: ["users.view", "users.create", "users.edit", "users.delete", "routes.view", "routes.create", "routes.edit", "routes.delete", "trips.view", "trips.create", "trips.edit", "trips.delete", "buses.view", "buses.create", "buses.edit", "buses.delete", "bookings.view", "bookings.edit", "bookings.delete", "payments.view", "payments.process", "settings.view", "settings.edit"]
  },
  { 
    id: "2", 
    name: "Manager", 
    description: "Can manage trips and bookings",
    usersCount: 5,
    permissions: ["users.view", "routes.view", "routes.create", "routes.edit", "trips.view", "trips.create", "trips.edit", "buses.view", "buses.create", "buses.edit", "bookings.view", "bookings.edit", "payments.view"]
  },
  { 
    id: "3", 
    name: "Support", 
    description: "Customer support staff",
    usersCount: 8,
    permissions: ["routes.view", "trips.view", "bookings.view", "bookings.edit", "payments.view"]
  },
  { 
    id: "4", 
    name: "Finance", 
    description: "Handles payments and refunds",
    usersCount: 3,
    permissions: ["bookings.view", "payments.view", "payments.process"]
  },
  { 
    id: "5", 
    name: "Driver", 
    description: "Bus drivers",
    usersCount: 12,
    permissions: ["trips.view"]
  },
];

const AdminRoles = () => {
  const handleEditRole = () => {
    toast.info("Role editing functionality to be implemented");
  };

  const handleCreateRole = () => {
    toast.info("Role creation functionality to be implemented");
  };

  const columns = [
    { key: "name", title: "Role" },
    { key: "description", title: "Description" },
    { 
      key: "usersCount", 
      title: "Users",
      render: (role: any) => `${role.usersCount} user${role.usersCount !== 1 ? 's' : ''}`
    },
    { 
      key: "permissions", 
      title: "Permissions",
      render: (role: any) => `${role.permissions.length} permission${role.permissions.length !== 1 ? 's' : ''}`
    },
  ];

  const actions = (role: any) => (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEditRole}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Role Management | TransitX Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
        <Button onClick={handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        keyExtractor={(item) => item.id}
        actions={actions}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Permissions are grouped by resource type and action. Each role can be assigned 
              different combinations of permissions to control access to TransitX features.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><span className="font-medium">View:</span> Read-only access</li>
              <li><span className="font-medium">Create:</span> Ability to add new items</li>
              <li><span className="font-medium">Edit:</span> Ability to modify existing items</li>
              <li><span className="font-medium">Delete:</span> Ability to remove items</li>
              <li><span className="font-medium">Process:</span> Ability to perform actions like processing payments</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              TransitX comes with predefined roles to help you get started quickly. These roles 
              can be modified to suit your organizational needs.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><span className="font-medium">Admin:</span> Full system access</li>
              <li><span className="font-medium">Manager:</span> Manages operations, trips and bookings</li>
              <li><span className="font-medium">Support:</span> Handles customer inquiries and bookings</li>
              <li><span className="font-medium">Finance:</span> Manages payments and financial aspects</li>
              <li><span className="font-medium">Driver:</span> Limited access for bus drivers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminRoles;
