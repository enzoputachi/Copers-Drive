import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { usePayments } from "@/hooks/useAdminQueries";
import api from "@/services/api";
import { render } from "@testing-library/react";

// —————————————————————————————————————————————
// 1) Mock payments data (IDs as strings)
// —————————————————————————————————————————————
const initialPayments = [
  {
    id: "1",
    bookingToken: "TX-2023-05-10",
    amount: 15000,
    method: "card",
    status: "successful",
    paidAt: "2023-05-10T09:35:00Z",
    reference: "PST-123456789",
  },
  {
    id: "2",
    bookingToken: "TX-2023-05-11",
    amount: 5000,
    method: "bank",
    status: "successful",
    paidAt: "2023-05-11T11:20:00Z",
    reference: "BTF-987654321",
  },
  {
    id: "3",
    bookingToken: "TX-2023-05-12",
    amount: 6500,
    method: "wallet",
    status: "pending",
    paidAt: null,
    reference: "WLT-567891234",
  },
  {
    id: "4",
    bookingToken: "TX-2023-05-13",
    amount: 8000,
    method: "card",
    status: "failed",
    paidAt: null,
    reference: "PST-456789123",
  },
];

// Toggle this to `false` to fetch from API instead of using mock
const USE_MOCK_PAYMENTS = false;

const AdminPayments = () => {
  // —————————————————————————————————————————————
  // 2) Local state for "data to display"
  // —————————————————————————————————————————————
  const [paymentsData, setPaymentsData] = useState([]);

  // —————————————————————————————————————————————
  // 3) React Query hook
  // —————————————————————————————————————————————
  const { data: apiPaymentsRaw = [], isLoading, error } = usePayments();
  const apiPayments = apiPaymentsRaw?.data?.data;

  // —————————————————————————————————————————————
  // 4) Effect: if mock flag is on, set mock. Otherwise, when API finishes, copy/format it.
  // —————————————————————————————————————————————
  useEffect(() => {
    console.log('payments:', apiPayments)
    if (USE_MOCK_PAYMENTS) {
      setPaymentsData(initialPayments);
    } else if (!isLoading && Array.isArray(apiPayments)) {
      const formatted = apiPayments.map((p: any) => ({
        ...p,
        id: String(p.id),
      }));
      setPaymentsData(formatted);
      
    }

  }, [apiPayments, isLoading]);

  // —————————————————————————————————————————————
  // 5) Loader/error only when not using mock
  // —————————————————————————————————————————————
  if (!USE_MOCK_PAYMENTS && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!USE_MOCK_PAYMENTS && error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Failed to load payments. Please try again.</p>
      </div>
    );
  }

  // —————————————————————————————————————————————
  // 6) Define columns for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { key: "bookingToken", 
      title: "Booking Token" ,
      render: (payment: any) => <span>{payment.booking.bookingToken}</span>
    },
    {
      key: "amount",
      title: "Amount",
      render: (payment: any) => `₦${(payment.amount /  100).toLocaleString()}`,
    },
    {
      key: "provider",
      title: "Provider",
      render: (payment: any) => <span className="capitalize">{payment.provider}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: (payment: any) => (
        <span
          className={`capitalize ${
            payment.status === "PAID"
              ? "text-green-600"
              : payment.status === "PENDING"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {payment.status}
        </span>
      ),
    },
    {
      key: "paidAt",
      title: "Paid At",
      render: (payment: any) =>
        payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "N/A",
    },
    { key: "paystackRef", title: "Reference" },
  ];

  return (
    <>
      <Helmet>
        <title>Payment Oversight | Corpers Drive Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment Oversight</h1>
      </div>

      <DataTable
        columns={columns}
        data={paymentsData}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

export default AdminPayments;
