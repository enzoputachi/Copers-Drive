import React, { useEffect, useState } from "react";
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
import { useSettings, useUpdateSettings } from "@/hooks/useAdminQueries";
import { SystemSettings } from "@/services/adminApi";
import { toast } from "sonner";

// —————————————————————————————————————————————
// 1) Mock defaults for SystemSettings
// —————————————————————————————————————————————
const initialMockSettings: SystemSettings = {
  companyName: "Corpers Drive Nigeria",
  contactEmail: "contact@Corpers Drive.ng",
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
const USE_MOCK_SETTINGS = true;

const AdminSettings = () => {
  // —————————————————————————————————————————————
  // 2) Hooks and mutations
  // —————————————————————————————————————————————
  const { data: apiSettings, isLoading, error } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  // Local form state holds “the object to display/edit”
  const [settingsData, setSettingsData] =
    useState<Partial<SystemSettings>>(initialMockSettings);

  // —————————————————————————————————————————————
  // 3) Sync API → form state (or load mock)
  // —————————————————————————————————————————————
  useEffect(() => {
    if (USE_MOCK_SETTINGS) {
      // Always load mock defaults
      setSettingsData(initialMockSettings);
    } else if (!isLoading && apiSettings) {
      // Copy API fields into form state
      setSettingsData(apiSettings);
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
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load settings. Please try again.</p>
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
    setSettingsData((prev) => ({ ...prev, [field]: value }));
  };

  // —————————————————————————————————————————————
  // 6) Handle Save per section
  //    • If mock: simulate a delay + toast
  //    • Otherwise: call the mutation with full settingsData
  // —————————————————————————————————————————————
  const handleSave = (overrides: Partial<SystemSettings>) => {
    const payload: SystemSettings = {
      ...(settingsData as SystemSettings),
      ...overrides,
    };

    if (USE_MOCK_SETTINGS) {
      toast.success("Settings saved (mock).");
      setSettingsData(payload);
      return;
    }

    updateSettingsMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Settings updated successfully.");
        setSettingsData(payload);
      },
      onError: () => {
        toast.error("Failed to update settings.");
      },
    });
  };

  // —————————————————————————————————————————————
  // 7) Render Tabs + Forms
  // —————————————————————————————————————————————
  return (
    <>
      <Helmet>
        <title>Settings | Corpers Drive Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* —————————————————————————————————————————————
            General Settings Tab
           ————————————————————————————————————————————— */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage system-wide settings for the Corpers Drive platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={settingsData.companyName || ""}
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
                  value={settingsData.contactEmail || ""}
                  onChange={(e) =>
                    updateField("contactEmail", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={settingsData.contactPhone || ""}
                  onChange={(e) =>
                    updateField("contactPhone", e.target.value)
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
                  checked={!!settingsData.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateField("maintenanceMode", checked)
                  }
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    companyName: settingsData.companyName,
                    contactEmail: settingsData.contactEmail,
                    contactPhone: settingsData.contactPhone,
                    maintenanceMode: settingsData.maintenanceMode,
                  })
                }
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
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
                  value={settingsData.seatHoldMinutes ?? 0}
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
                  value={settingsData.maxSeatsPerBooking ?? 0}
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
                  value={settingsData.bookingDeadlineHours ?? 0}
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
                    seatHoldMinutes: settingsData.seatHoldMinutes,
                    maxSeatsPerBooking: settingsData.maxSeatsPerBooking,
                    bookingDeadlineHours: settingsData.bookingDeadlineHours,
                  })
                }
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
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
                  checked={!!settingsData.paystackEnabled}
                  onCheckedChange={(checked) =>
                    updateField("paystackEnabled", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-key">Paystack Public Key</Label>
                <Input
                  id="paystack-key"
                  value={settingsData.paystackPublicKey || ""}
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
                  checked={!!settingsData.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    updateField("bankTransferEnabled", checked)
                  }
                />
              </div>

              <Button
                onClick={() =>
                  handleSave({
                    paystackEnabled: settingsData.paystackEnabled,
                    paystackPublicKey: settingsData.paystackPublicKey,
                    bankTransferEnabled: settingsData.bankTransferEnabled,
                  })
                }
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
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
                  checked={!!settingsData.bookingEmailsEnabled}
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
                  checked={!!settingsData.paymentEmailsEnabled}
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
                  checked={!!settingsData.reminderSmsEnabled}
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
                  value={settingsData.reminderHours ?? 0}
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
                    bookingEmailsEnabled: settingsData.bookingEmailsEnabled,
                    paymentEmailsEnabled: settingsData.paymentEmailsEnabled,
                    reminderSmsEnabled: settingsData.reminderSmsEnabled,
                    reminderHours: settingsData.reminderHours,
                  })
                }
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AdminSettings;
