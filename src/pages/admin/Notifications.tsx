import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNotifications, useCreateNotification } from "@/hooks/useAdminQueries";
import { Notification } from "@/services/adminApi";
import FormModal from "@/components/admin/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// —————————————————————————————————————————————
// 1) Mock notifications data (IDs as strings!)
// —————————————————————————————————————————————
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "email",
    contactInfo: "john.doe@example.com",
    message: "Your booking TX-2023-05-10 has been confirmed.",
    sentAt: "2023-05-10T09:40:00Z",
    status: "delivered",
    // bookingId: 1,
    // booking: [],
  },
  {
    id: 2,
    type: "sms",
    contactInfo: "+2348012345678",
    message: "Your trip to Ibadan is scheduled for tomorrow at 10:00 AM.",
    sentAt: "2023-05-11T08:00:00Z",
    status: "delivered",
  },
  {
    id: 3,
    type: "email",
    contactInfo: "robert.johnson@example.com",
    message: "Your payment of ₦6,500 is pending confirmation.",
    sentAt: "2023-05-12T14:50:00Z",
    status: "pending",
  },
  {
    id: 4,
    type: "sms",
    contactInfo: "+2349087654321",
    message: "Your booking TX-2023-05-13 has been canceled.",
    sentAt: "2023-05-13T08:30:00Z",
    status: "failed",
  },
];

// Toggle this to `true` if you want to work entirely with mock data
const USE_MOCK_NOTIFICATIONS = true;

const AdminNotifications = () => {
  // —————————————————————————————————————————————
  // 2) Local state always holds “the array to display”
  // —————————————————————————————————————————————
  const [notificationsData, setNotificationsData] = useState<Notification[]>(initialNotifications);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for “Send New Notification”
  const [formData, setFormData] = useState<{
    type: "email" | "sms";
    contactInfo: string;
    message: string;
  }>({
    type: "email",
    contactInfo: "",
    message: "",
  });

  // —————————————————————————————————————————————
  // 3) React-Query hooks
  // —————————————————————————————————————————————
  const {
    data: apiNotifications = [],
    isLoading,
    error,
  } = useNotifications();
  const createNotificationMutation = useCreateNotification();

  // —————————————————————————————————————————————
  // 4) Effect: if mock-flag is on → load initialNotifications.
  //    Otherwise, once API finishes loading, copy/format the results.
  // —————————————————————————————————————————————
  useEffect(() => {
    if (USE_MOCK_NOTIFICATIONS) {
      setNotificationsData(initialNotifications);
    } else if (!isLoading) {
      if (Array.isArray(apiNotifications)) {
        // Ensure `id` is a string, and leave other fields as-is
        const formatted = apiNotifications.map((n) => ({
          ...n,
          id: String(n.id),
        }));
        setNotificationsData(apiNotifications);
      } else {
        console.warn("No notifications from API. Falling back to mock.");
        setNotificationsData(initialNotifications);
      }
    }
  }, [apiNotifications, isLoading]);

  // —————————————————————————————————————————————
  // 5) Handle “Send New Notification”
  //    • If using mock: append to notificationsData with a simulated delay
  //    • Otherwise: call the API mutation
  // —————————————————————————————————————————————
  const handleCreateNotification = () => {
    const { type, contactInfo, message } = formData;
    if (USE_MOCK_NOTIFICATIONS) {
      setIsSubmitting(true);

      setTimeout(() => {
        const newEntry: Notification = {
          id: Date.now(),
          type,
          contactInfo,
          message,
          sentAt: new Date().toISOString(),
          status: "pending",
        };
        setNotificationsData((prev) => [newEntry, ...prev]);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({ type: "email", contactInfo: "", message: "" });
        toast.success("Notification added (mock).");
      }, 500);

      return;
    }

    // Real API call
    createNotificationMutation.mutate(
      { type, contactInfo, message },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setFormData({ type: "email", contactInfo: "", message: "" });
          toast.success("Notification sent.");
        },
      }
    );
  };

  // —————————————————————————————————————————————
  // 6) Loading / Error states (only when using real API)
  // —————————————————————————————————————————————
  if (!USE_MOCK_NOTIFICATIONS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_NOTIFICATIONS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load notifications. Please try again.</p>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 7) Define columns for DataTable
  // —————————————————————————————————————————————
  const columns = [
    {
      key: "type",
      title: "Type",
      render: (notification: Notification) => (
        <span className="capitalize">{notification.type}</span>
      ),
    },
    { key: "contactInfo", title: "Contact Info" },
    { key: "message", title: "Message" },
    {
      key: "sentAt",
      title: "Sent At",
      render: (notification: Notification) =>
        new Date(notification.sentAt).toLocaleString(),
    },
    {
      key: "status",
      title: "Status",
      render: (notification: Notification) => (
        <span
          className={`capitalize ${
            notification.status === "delivered"
              ? "text-green-600"
              : notification.status === "pending"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {notification.status}
        </span>
      ),
    },
  ];

  // —————————————————————————————————————————————
  // 8) Render table + “Send New Notification” modal
  // —————————————————————————————————————————————
  return (
    <>
      <Helmet>
        <title>Notifications | Corpers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Notification
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={notificationsData}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Create Notification Modal */}
      <FormModal
        title="Send New Notification"
        description="Send a notification to users via email or SMS."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={() => {}}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as "email" | "sms" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contactInfo">
              {formData.type === "email" ? "Email Address" : "Phone Number"}
            </Label>
            <Input
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder={
                formData.type === "email"
                  ? "user@example.com"
                  : "+234 801 234 5678"
              }
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting || createNotificationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNotification}
              disabled={
                isSubmitting ||
                createNotificationMutation.isPending ||
                !formData.contactInfo ||
                !formData.message
              }
            >
              {isSubmitting || createNotificationMutation.isPending
                ? "Sending..."
                : "Send Notification"}
            </Button>
          </div>
        </div>
      </FormModal>
    </>
  );
};

export default AdminNotifications;
