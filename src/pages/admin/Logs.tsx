import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLogs } from "@/hooks/useAdminQueries";
import { SystemLog } from "@/services/adminApi";

// ————————————————————————————————————
// Toggle: switch to true for mock mode
// ————————————————————————————————————
const USE_MOCK_LOGS = true;

const bookingLogs: SystemLog[] = [
  {
    id: "1",
    type: "booking",
    action: "created",
    details: "Booking TX-2023-05-10 created for John Doe",
    timestamp: "2023-05-10T09:30:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    type: "booking",
    action: "updated",
    details: "Booking TX-2023-05-11 seat changed from 2A to 3C",
    timestamp: "2023-05-11T10:20:00Z",
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    type: "booking",
    action: "canceled",
    details: "Booking TX-2023-05-13 canceled by user",
    timestamp: "2023-05-13T08:25:00Z",
    ipAddress: "192.168.1.4",
  },
];

const adminLogs: SystemLog[] = [
  {
    id: "4",
    type: "admin",
    action: "user_created",
    details: "New user support@Corpers Drive.ng created by admin",
    timestamp: "2023-05-09T11:15:00Z",
    ipAddress: "192.168.1.10",
  },
  {
    id: "5",
    type: "admin",
    action: "trip_added",
    details: "New trip Lagos to Abuja added",
    timestamp: "2023-05-08T14:30:00Z",
    ipAddress: "192.168.1.10",
  },
  {
    id: "6",
    type: "admin",
    action: "settings_updated",
    details: "System settings updated",
    timestamp: "2023-05-07T16:45:00Z",
    ipAddress: "192.168.1.11",
  },
];

const AdminLogs = () => {
  const [logType, setLogType] = useState<"all" | "booking" | "admin">("all");
  const [logsData, setLogsData] = useState<SystemLog[]>([]);

  const { data: logs = [], isLoading, error } = useLogs(
    logType === "all" ? undefined : logType
  );

  useEffect(() => {
    if (USE_MOCK_LOGS) {
      const combined = [...bookingLogs, ...adminLogs];
      const filtered =
        logType === "all"
          ? combined.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
          : logType === "booking"
          ? bookingLogs
          : adminLogs;
      setLogsData(filtered);
    } else {
      setLogsData(logs);
    }
  }, [logType, logs]);

  const columns = [
    {
      key: "type",
      title: "Type",
      render: (log: SystemLog) => (
        <span className="capitalize">{log.type}</span>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (log: SystemLog) => (
        <span className="capitalize">{log.action.replace("_", " ")}</span>
      ),
    },
    { key: "details", title: "Details" },
    {
      key: "timestamp",
      title: "Timestamp",
      render: (log: SystemLog) =>
        new Date(log.timestamp).toLocaleString(),
    },
    { key: "ipAddress", title: "IP Address" },
  ];

  if (!USE_MOCK_LOGS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_LOGS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load logs. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>System Logs | Corpers Drive Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
      </div>

      <div className="mb-6">
        <RadioGroup
          value={logType}
          onValueChange={(value) =>
            setLogType(value as "all" | "booking" | "admin")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Logs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="booking" id="booking" />
            <Label htmlFor="booking">Booking Logs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Admin Logs</Label>
          </div>
        </RadioGroup>
      </div>

      <DataTable
        columns={columns}
        data={logsData}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

export default AdminLogs;
