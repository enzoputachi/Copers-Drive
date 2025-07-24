import React, { useEffect, useState } from "react";
import { Users, Bus, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import SummaryCard from "@/components/admin/SummaryCard";
import ActivityFeed, { ActivityItem } from "@/components/admin/ActivityFeed";
import { useDashboardStats } from "@/hooks/useAdminQueries";

// Mock Data for fallback
const mockStats = {
  totalBookings: 2345,
  // userGrowth: 12,
  activeTrips: 48,
  tripGrowth: 5,
  pendingBookings: 124,
  bookingGrowth: -2,
  monthlyRevenue: 1345200,
  revenueGrowth: 18 
};

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    action: "created a new route",
    subject: "Lagos to Abuja",
    timestamp: "2 minutes ago",
    user: { name: "Admin User", email: "admin@Corpers Drive.ng" }
  },
  {
    id: "2",
    action: "updated bus",
    subject: "ABC-123XY",
    timestamp: "15 minutes ago",
    user: { name: "Operation Manager", email: "ops@Corpers Drive.ng" }
  },
  {
    id: "3",
    action: "canceled booking",
    subject: "TX-2023-05-10",
    timestamp: "3 hours ago",
    user: { name: "Support Staff", email: "support@Corpers Drive.ng" }
  },
  {
    id: "4",
    action: "processed payment",
    subject: "₦25,000.00",
    timestamp: "5 hours ago",
    user: { name: "Finance Admin", email: "finance@Corpers Drive.ng" }
  },
  {
    id: "5",
    action: "added a new trip",
    subject: "Lagos to Ibadan",
    timestamp: "Yesterday",
    user: { name: "Admin User", email: "admin@Corpers Drive.ng" }
  }
];


// Toggle this to true or false to control mock data usage
const USE_MOCK_STATS = false;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardStats();
  // const data = dataRaw.data;
  console.log( "Dashboard", data);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (USE_MOCK_STATS) {
    setStats(mockStats);
  } else if (!isLoading) {
    if (data && Object.keys(data).length > 0) {
      setStats(data);
    } else {
      setStats(null); // fallback only if API returns nothing 
    }
  }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Corpers Drive Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Reports</Button>
          <Button onClick={() => navigate("/trips")}>New Trip</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCard
          title="Total Bookings"
          value={stats?.data?.totalBookings?.toLocaleString() || "0"}
          icon={<Users className="h-6 w-6" />}
          change={{ value: stats?.data?.bookingGrowth || 0, positive: (stats?.data?.bookingGrowth || 0) > 0 }}
        />
        <SummaryCard
          title="Active Trips"
          value={stats?.data?.activeTrips?.toString() || "0"}
          icon={<Calendar className="h-6 w-6" />}
          change={{ value: stats?.data?.tripGrowth || 0, positive: (stats?.data?.tripGrowth || 0) > 0 }}
        />
        <SummaryCard
          title="Pending Bookings"
          value={stats?.data?.pendingBookings?.toString() || "0"}
          icon={<Bus className="h-6 w-6" />}
          change={{ value: stats?.data?.bookingGrowth || 0, positive: (stats?.data?.bookingGrowth || 0) > 0 }}
        />
        <SummaryCard
          title="Revenue (This Month)"
          value={`₦${stats?.data?.monthlyRevenue?.toLocaleString() || "0"}`}
          icon={<CreditCard className="h-6 w-6" />}
          change={{ value: stats?.data?.revenueGrowth || 0, positive: (stats?.data?.revenueGrowth || 0) > 0 }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <ActivityFeed activities={recentActivities} className="lg:col-span-2" />

        {/* Quick Actions */}
        <Card className="">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate("/routes")}>
              Create New Route
            </Button>
            <Button className="w-full justify-start" onClick={() => navigate("/trips")}>
              Schedule New Trip
            </Button>
            <Button className="w-full justify-start" onClick={() => navigate("/payments")}>
              View Pending Payments
            </Button>
            <Button className="w-full justify-start" onClick={() => navigate("/buses")}>
              Manage Bus Fleet
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
