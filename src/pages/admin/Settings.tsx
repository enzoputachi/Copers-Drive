import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  useSettings, 
  useUpdateSettings, 
  useCreateSettings, 
  useDeleteSettings 
} from "@/hooks/useAdminQueries";
import { SystemSettings, SystemSettingsResponse } from "@/services/adminApi";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// —————————————————————————————————————————————
// 1) Mock defaults for SystemSettings
// —————————————————————————————————————————————
const initialMockSettings: Omit<SystemSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  // Prisma schema fields
  companyName: "Corpers Drive Nigeria",
  supportEmail: "contact@corpersdrive.ng",
  supportPhone: "+234 801 234 5678",
  websiteUrl: "https://corpersdrive.ng",
  facebookUrl: null,
  twitterUrl: null,
  whatsAppUrl: null,
  whatsAppGroupUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  address: "No 1, Jibowu, Yaba, Lagos State",

  // Your original system settings fields
  contactEmail: "contact@corpersdrive.ng",
  contactPhone: "+234 801 234 5678",
  maintenanceMode: false,
  seatHoldMinutes: 15,
  maxSeatsPerBooking: 5,
  bookingDeadlineHours: 2,
  paystackEnabled: true,
  paystackPublicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
  bankTransferEnabled: true,
  bookingEmailsEnabled: true,
  paymentEmailsEnabled: true,
  reminderSmsEnabled: true,
  reminderHours: 24,
};

// Toggle to force‐use mock data instead of hitting the API
const USE_MOCK_SETTINGS = false;

const AdminSettings = () => {
  // —————————————————————————————————————————————
  // 2) Hooks and mutations
  // —————————————————————————————————————————————
  const { data: apiSettings, isLoading, error, refetch } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const createSettingsMutation = useCreateSettings();
  const deleteSettingsMutation = useDeleteSettings();
  
  const [settingsData, setSettingsData] = useState<Partial<SystemSettings> | null>(null);
  const [originalSettings, setOriginalSettings] = useState<Partial<SystemSettings> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Determine if we're in create mode (no existing settings)
  const isCreateMode = !apiSettings?.id && !USE_MOCK_SETTINGS;

  console.log('Is create mode', isCreateMode);

  // —————————————————————————————————————————————
  // 3) Sync API → form state (or load mock) - FIXED
  // —————————————————————————————————————————————
  useEffect(() => {
    if (USE_MOCK_SETTINGS) {
      // Always load mock defaults
      const mockData = { ...initialMockSettings, id: 1 };
      setSettingsData(mockData);
      setOriginalSettings(mockData);
      setIsCreating(false);
    } else if (!isLoading) {
      if (apiSettings?.id) {
        // Existing settings - load them
        setSettingsData(apiSettings);
        setOriginalSettings(apiSettings);
        setIsCreating(false);
      } else {
        // No settings exist - prepare for creation
        setSettingsData(initialMockSettings);
        setOriginalSettings(null);
        setIsCreating(true);
      }
    }
  }, [apiSettings, isLoading]);

  // —————————————————————————————————————————————
  // 4) Loading / Error (only when not using mock)
  // —————————————————————————————————————————————
  if (!USE_MOCK_SETTINGS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_SETTINGS && error) {
    return (
      <div className="flex items-center justify-center h-96 flex-col space-y-4">
        <p className="text-red-600">Failed to load settings.</p>
        <Button onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Don't render until we have settings data
  if (!settingsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 5) Helper to update a single field in form state
  // —————————————————————————————————————————————
  const updateField = (
    field: keyof SystemSettings,
    value: SystemSettings[keyof SystemSettings]
  ) => {
    setSettingsData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  // —————————————————————————————————————————————
  // 6) Handle Create Settings
  // —————————————————————————————————————————————
  const handleCreate = (overrides: Partial<SystemSettings>) => {
    const payload = {
     data: {
      ...initialMockSettings,
      ...settingsData,
      ...overrides,
     }
    };

    if (!window.confirm("Are you sure you want to create these settings?")) {
      return;
    }

    if (USE_MOCK_SETTINGS) {
      toast.success("Settings created (mock).");
      const newData = { ...payload, id: 1 };
      setSettingsData(newData);
      setOriginalSettings(newData);
      setIsCreating(false);
      return;
    }

    createSettingsMutation.mutate(payload as Omit<SystemSettingsResponse, "id">, {
      onSuccess: (data) => {
        toast.success("Settings created successfully.");
        const response = data.data;
        setSettingsData(response);
        setOriginalSettings(response);
        setIsCreating(false);
        // Refetch to ensure we have the latest data
        refetch();
      },
      onError: (error) => {
        console.error("Create error:", error);
        toast.error("Failed to create settings.");
      },
    });
  };

  // —————————————————————————————————————————————
  // 7) Handle Update Settings
  // —————————————————————————————————————————————
  const handleUpdate = (overrides: Partial<SystemSettings>) => {
    if (!settingsData) return;
    
    const payload: SystemSettings = {
      ...(settingsData as SystemSettings),
      ...overrides,
    };

    const hasChanges = Object.keys(overrides).some(
      (key) => payload[key] !== originalSettings?.[key]
    );

    if (!hasChanges) {
      toast.info("No changes detected");
      return;
    }

    if (!window.confirm("Are you sure you want to save changes?")) {
      return;
    }

    if (USE_MOCK_SETTINGS) {
      toast.success("Settings updated (mock).");
      setSettingsData(payload);
      setOriginalSettings(payload);
      return;
    }

    updateSettingsMutation.mutate(
      { id: payload.id, settings: payload as Partial<SystemSettingsResponse> },
      {
        onSuccess: (data) => {
          toast.success("Settings updated successfully.");
          const settings: SystemSettings = data.data.data;
          setSettingsData(settings);
          setOriginalSettings(settings);
          // Refetch to ensure we have the latest data
          refetch();
        },
        onError: (error) => {
          console.error("Update error:", error);
          toast.error("Failed to update settings.");
        },
      }
    );
  };

  // —————————————————————————————————————————————
  // 8) Handle Delete Settings
  // —————————————————————————————————————————————
  const handleDelete = () => {
    if (!settingsData?.id) {
      toast.error("Cannot delete: No settings found");
      return;
    }

    if (USE_MOCK_SETTINGS) {
      toast.success("Settings deleted (mock).");
      setSettingsData(initialMockSettings);
      setOriginalSettings(null);
      setIsCreating(true);
      return;
    }

    deleteSettingsMutation.mutate(settingsData.id, {
      onSuccess: () => {
        toast.success("Settings deleted successfully.");
        setSettingsData(initialMockSettings);
        setOriginalSettings(null);
        setIsCreating(true);
        // Refetch to ensure we have the latest data
        refetch();
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete settings.");
      },
    });
  };

  // —————————————————————————————————————————————
  // 9) Main save handler that decides between create/update
  // —————————————————————————————————————————————
  const handleSave = (overrides: Partial<SystemSettings>) => {
    if (isCreating || !settingsData?.id) {
      handleCreate(overrides);
    } else {
      handleUpdate(overrides);
    }
  };

  // —————————————————————————————————————————————
  // 10) Check if any mutation is pending
  // —————————————————————————————————————————————
  const isMutationPending = 
    updateSettingsMutation.isPending || 
    createSettingsMutation.isPending || 
    deleteSettingsMutation.isPending;

  // —————————————————————————————————————————————
  // 11) Render Tabs + Forms
  // —————————————————————————————————————————————
  return (
    <>
      <Helmet>
        <title>Settings | Corpers Drive Admin</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            {isCreating ? "Create new system settings" : "Manage system settings"}
          </p>
        </div>
        
        {/* Delete Button - Only show if not creating and settings exist */}
        {!isCreating && settingsData?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Delete Settings
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all system settings? This action cannot be undone.
                  You will need to recreate the settings from scratch.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isMutationPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteSettingsMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          {/* <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
        </TabsList>

        {/* —————————————————————————————————————————————
            General Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                {isCreating 
                  ? "Create system-wide settings for the Corpers Drive platform"
                  : "Manage system-wide settings for the Corpers Drive platform"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={settingsData?.companyName || ""}
                  onChange={(e) =>
                    updateField("companyName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settingsData?.contactEmail || ""}
                  onChange={(e) =>
                    updateField("contactEmail", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={settingsData?.contactPhone || ""}
                  onChange={(e) =>
                    updateField("contactPhone", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settingsData?.address || ""}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable maintenance mode to temporarily disable the public
                    site
                  </div>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={!!settingsData?.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateField("maintenanceMode", checked)
                  }
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    companyName: settingsData?.companyName,
                    contactEmail: settingsData?.contactEmail,
                    contactPhone: settingsData?.contactPhone,
                    maintenanceMode: settingsData?.maintenanceMode,
                    address: settingsData?.address,
                  })
                }
                disabled={isMutationPending}
                className="w-full sm:w-auto"
              >
                {isMutationPending
                  ? (isCreating ? "Creating..." : "Saving...")
                  : (isCreating ? "Create Settings" : "Save Changes")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* —————————————————————————————————————————————
            Links Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Links Settings</CardTitle>
              <CardDescription>
                {isCreating 
                  ? "Set up link settings for the Corpers Drive platform"
                  : "Manage link settings for the Corpers Drive platform"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  value={settingsData?.websiteUrl || ""}
                  onChange={(e) =>
                    updateField("websiteUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook-url">Facebook URL</Label>
                <Input
                  id="facebook-url"
                  value={settingsData?.facebookUrl || ""}
                  onChange={(e) =>
                    updateField("facebookUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-url">Twitter URL</Label>
                <Input
                  id="twitter-url"
                  value={settingsData?.twitterUrl || ""}
                  onChange={(e) =>
                    updateField("twitterUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-url">WhatsApp URL</Label>
                <Input
                  id="whatsapp-url"
                  value={settingsData?.whatsAppUrl || ""}
                  onChange={(e) =>
                    updateField("whatsAppUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-group-url">WhatsApp Group URL</Label>
                <Input
                  id="whatsapp-group-url"
                  value={settingsData?.whatsAppGroupUrl || ""}
                  onChange={(e) =>
                    updateField("whatsAppGroupUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram-url">Instagram URL</Label>
                <Input
                  id="instagram-url"
                  value={settingsData?.instagramUrl || ""}
                  onChange={(e) =>
                    updateField("instagramUrl", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input
                  id="linkedin-url"
                  value={settingsData?.linkedinUrl || ""}
                  onChange={(e) =>
                    updateField("linkedinUrl", e.target.value)
                  }
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    websiteUrl: settingsData?.websiteUrl,
                    facebookUrl: settingsData?.facebookUrl,
                    twitterUrl: settingsData?.twitterUrl,
                    whatsAppUrl: settingsData?.whatsAppUrl,
                    whatsAppGroupUrl: settingsData?.whatsAppGroupUrl,
                    instagramUrl: settingsData?.instagramUrl,
                    linkedinUrl: settingsData?.linkedinUrl,
                  })
                }
                disabled={isMutationPending}
                className="w-full sm:w-auto"
              >
                {isMutationPending
                  ? (isCreating ? "Creating..." : "Saving...")
                  : (isCreating ? "Create Settings" : "Save Changes")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* —————————————————————————————————————————————
            Booking Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure settings related to the booking process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seat-hold-minutes">
                  Seat Hold Time (minutes)
                </Label>
                <Input
                  id="seat-hold-minutes"
                  type="number"
                  value={settingsData?.seatHoldMinutes ?? 0}
                  onChange={(e) =>
                    updateField("seatHoldMinutes", parseInt(e.target.value))
                  }
                  min={5}
                  max={60}
                />
                <p className="text-sm text-muted-foreground">
                  Time before unpaid seats are released back to inventory
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-seats">Maximum Seats Per Booking</Label>
                <Input
                  id="max-seats"
                  type="number"
                  value={settingsData?.maxSeatsPerBooking ?? 0}
                  onChange={(e) =>
                    updateField(
                      "maxSeatsPerBooking",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                  max={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-deadline">
                  Booking Deadline (hours before departure)
                </Label>
                <Input
                  id="booking-deadline"
                  type="number"
                  value={settingsData?.bookingDeadlineHours ?? 0}
                  onChange={(e) =>
                    updateField(
                      "bookingDeadlineHours",
                      parseInt(e.target.value)
                    )
                  }
                  min={0}
                  max={24}
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    seatHoldMinutes: settingsData?.seatHoldMinutes,
                    maxSeatsPerBooking: settingsData?.maxSeatsPerBooking,
                    bookingDeadlineHours: settingsData?.bookingDeadlineHours,
                  })
                }
                disabled={isMutationPending}
                className="w-full sm:w-auto"
              >
                {isMutationPending
                  ? (isCreating ? "Creating..." : "Saving...")
                  : (isCreating ? "Create Settings" : "Save Changes")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* —————————————————————————————————————————————
            Payment Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment providers and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paystack-enabled">Paystack Enabled</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable Paystack payment gateway
                  </div>
                </div>
                <Switch
                  id="paystack-enabled"
                  checked={!!settingsData?.paystackEnabled}
                  onCheckedChange={(checked) =>
                    updateField("paystackEnabled", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-key">Paystack Public Key</Label>
                <Input
                  id="paystack-key"
                  value={settingsData?.paystackPublicKey || ""}
                  onChange={(e) =>
                    updateField("paystackPublicKey", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bank-transfer-enabled">
                    Bank Transfer Enabled
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Allow customers to pay via bank transfer
                  </div>
                </div>
                <Switch
                  id="bank-transfer-enabled"
                  checked={!!settingsData?.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    updateField("bankTransferEnabled", checked)
                  }
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    paystackEnabled: settingsData?.paystackEnabled,
                    paystackPublicKey: settingsData?.paystackPublicKey,
                    bankTransferEnabled: settingsData?.bankTransferEnabled,
                  })
                }
                disabled={isMutationPending}
                className="w-full sm:w-auto"
              >
                {isMutationPending
                  ? (isCreating ? "Creating..." : "Saving...")
                  : (isCreating ? "Create Settings" : "Save Changes")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* —————————————————————————————————————————————
            Notification Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and SMS notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-emails">
                    Booking Confirmation Emails
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Send email confirmations for new bookings
                  </div>
                </div>
                <Switch
                  id="booking-emails"
                  checked={!!settingsData?.bookingEmailsEnabled}
                  onCheckedChange={(checked) =>
                    updateField("bookingEmailsEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-emails">
                    Payment Confirmation Emails
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Send email confirmations for payments
                  </div>
                </div>
                <Switch
                  id="payment-emails"
                  checked={!!settingsData?.paymentEmailsEnabled}
                  onCheckedChange={(checked) =>
                    updateField("paymentEmailsEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder-sms">Trip Reminder SMS</Label>
                  <div className="text-sm text-muted-foreground">
                    Send SMS reminders before trip departure
                  </div>
                </div>
                <Switch
                  id="reminder-sms"
                  checked={!!settingsData?.reminderSmsEnabled}
                  onCheckedChange={(checked) =>
                    updateField("reminderSmsEnabled", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-hours">
                  Reminder Hours Before Departure
                </Label>
                <Input
                  id="reminder-hours"
                  type="number"
                  value={settingsData?.reminderHours ?? 0}
                  onChange={(e) =>
                    updateField("reminderHours", parseInt(e.target.value))
                  }
                  min={1}
                  max={72}
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    bookingEmailsEnabled: settingsData?.bookingEmailsEnabled,
                    paymentEmailsEnabled: settingsData?.paymentEmailsEnabled,
                    reminderSmsEnabled: settingsData?.reminderSmsEnabled,
                    reminderHours: settingsData?.reminderHours,
                  })
                }
                disabled={isMutationPending}
                className="w-full sm:w-auto"
              >
                {isMutationPending
                  ? (isCreating ? "Creating..." : "Saving...")
                  : (isCreating ? "Create Settings" : "Save Changes")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AdminSettings;