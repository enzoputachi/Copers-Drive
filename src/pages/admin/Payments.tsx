import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataTable from "@/components/admin/DataTable";
import { usePayments, useUpdatePayment } from "@/hooks/useAdminQueries";
import { Edit, Save, X, Check } from "lucide-react";

// Define the edit form interface
interface EditForm {
  status: 'PENDING' | 'PAID' | 'FAILED';
  amount: number;
  paidAt: string;
  paystackRef: string;
}

// —————————————————————————————————————————————
// 1) Mock payments data (IDs as strings)
// —————————————————————————————————————————————
const initialPayments = [
  {
    id: "1",
    booking: {
      bookingToken: "TX-2023-05-10",
      passengerName: "John Doe"
    },
    amount: 1500000,
    provider: "Paystack",
    status: "PAID",
    paidAt: "2023-05-10T09:35:00Z",
    paystackRef: "PST-123456789",
    createdAt: "2023-05-10T09:30:00Z",
    updatedAt: "2023-05-10T09:35:00Z",
  },
  {
    id: "2",
    booking: {
      bookingToken: "TX-2023-05-11",
      passengerName: "Jane Smith"
    },
    amount: 500000,
    provider: "Paystack",
    status: "PENDING",
    paidAt: null,
    paystackRef: "BTF-987654321",
    createdAt: "2023-05-11T11:15:00Z",
    updatedAt: "2023-05-11T11:20:00Z",
  },
  {
    id: "3",
    booking: {
      bookingToken: "TX-2023-05-12",
      passengerName: "Robert Johnson"
    },
    amount: 650000,
    provider: "Paystack",
    status: "PENDING",
    paidAt: null,
    paystackRef: "WLT-567891234",
    createdAt: "2023-05-12T14:40:00Z",
    updatedAt: "2023-05-12T14:45:00Z",
  },
  {
    id: "4",
    booking: {
      bookingToken: "TX-2023-05-13",
      passengerName: "Emily Williams"
    },
    amount: 800000,
    provider: "Paystack",
    status: "FAILED",
    paidAt: null,
    paystackRef: "PST-456789123",
    createdAt: "2023-05-13T08:15:00Z",
    updatedAt: "2023-05-13T08:20:00Z",
  },
];

// Toggle this to `false` to fetch from API instead of using mock
const USE_MOCK_PAYMENTS = false;

const AdminPayments = () => {
  // —————————————————————————————————————————————
  // 2) Local state for "data to display"
  // —————————————————————————————————————————————
  const [paymentsData, setPaymentsData] = useState([]);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    status: 'PENDING',
    amount: 0,
    paidAt: '',
    paystackRef: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // —————————————————————————————————————————————
  // 3) React Query hooks
  // —————————————————————————————————————————————
  const { mutateAsync: updatePayment, isPending: isUpdating } = useUpdatePayment();
  const { data: apiPaymentsRaw = [], isLoading, error } = usePayments();
  const apiPayments = apiPaymentsRaw?.data;

  // —————————————————————————————————————————————
  // 4) Effect: if mock flag is on, set mock. Otherwise, when API finishes, copy/format it.
  // —————————————————————————————————————————————
  useEffect(() => {
    console.log('API PAYMENTS:', apiPayments);

    if (USE_MOCK_PAYMENTS) {
      setPaymentsData(initialPayments);
    } else if (!isLoading && Array.isArray(apiPayments)) {
      const formatted = apiPayments.map((p: any) => ({
        ...p,
        id: String(p.id),
      }));
      console.log("Formatted payments:", formatted);
      setPaymentsData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(formatted)) return prev;
        return formatted;
      });
    }
  }, [apiPayments, isLoading]);

  // —————————————————————————————————————————————
  // 5) Edit functionality
  // —————————————————————————————————————————————
  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment.id);
    setEditForm({
      status: payment.status || 'PENDING',
      amount: payment.amount / 100, // Convert from kobo to naira for editing
      paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString().slice(0, 16) : '',
      paystackRef: payment.paystackRef || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
    setEditForm({
      status: 'PENDING',
      amount: 0,
      paidAt: '',
      paystackRef: '',
    });
  };

  const handleSavePayment = async (paymentId: string) => {
    setIsSubmitting(true);
    try {
      const payment = paymentsData.find((p: any) => p.id === paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const updateData = {
        status: editForm.status as any, // Cast to satisfy PaymentStatus type
        amount: editForm.amount * 100, // Convert back to kobo
        paidAt: editForm.status === 'PAID' && editForm.paidAt ? editForm.paidAt : null,
        paystackRef: editForm.paystackRef,
      };

      console.log('Updating payment with ID:', payment.id);

      // API call to update payment using the mutation hook
      await updatePayment({
        paymentData: {
          bookingToken: payment.booking.bookingToken,
          status: editForm.status,
          amount: editForm.amount * 100,
          paidAt: editForm.status === 'PAID' && editForm.paidAt ? editForm.paidAt : null,
          paystackRef: editForm.paystackRef,
        }
      });

      // Update local state
      setPaymentsData((prev: any) => prev.map((p: any) => 
        p.id === payment.id 
          ? { ...p, ...updateData, updatedAt: new Date().toISOString() }
          : p
      ));

      setEditingPayment(null);
      setEditForm({
        status: 'PENDING',
        amount: 0,
        paidAt: '',
        paystackRef: '',
      });
      alert('Payment updated successfully!');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickConfirm = async (payment: any) => {
    setIsSubmitting(true);
    try {
      const updateData = {
        status: 'PAID' as any, // Cast to satisfy PaymentStatus type
        paidAt: new Date().toISOString(),
      };

      // API call to update payment using the mutation hook
      await updatePayment({
        paymentData: {
          bookingToken: payment.booking.bookingToken,
          status: 'PAID',
          paidAt: new Date().toISOString(),
        }
      });

      // Update local state
      setPaymentsData((prev: any) => prev.map((p: any) => 
        p.id === payment.id 
          ? { ...p, ...updateData, updatedAt: new Date().toISOString() }
          : p
      ));

      alert('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // —————————————————————————————————————————————
  // 6) Loader/error only when not using mock
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
  // 7) Define columns for DataTable
  // —————————————————————————————————————————————
  const columns = [
    { 
      key: "bookingToken", 
      title: "Booking Token",
      render: (payment: any) => (
        <span className="font-mono text-sm">{payment.booking.bookingToken}</span>
      )
    },
    {
      key: "passengerName",
      title: "Passenger Name",
      render: (payment: any) => (
        <span className="font-medium">{payment.booking.passengerName}</span>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      render: (payment: any) => (
        <div className="min-w-[100px]">
          {editingPayment === payment.id ? (
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({...editForm, amount: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Amount in ₦"
              step="0.01"
            />
          ) : (
            `₦${(payment.amount / 100).toLocaleString()}`
          )}
        </div>
      ),
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
        <div className="min-w-[120px]">
          {editingPayment === payment.id ? (
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: e.target.value as 'PENDING' | 'PAID' | 'FAILED'})}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
          ) : (
            <span
              className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                payment.status === "PAID"
                  ? "bg-green-100 text-green-800"
                  : payment.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {payment.status}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "paidAt",
      title: "Paid At",
      render: (payment: any) => (
        <div className="min-w-[150px]">
          {editingPayment === payment.id ? (
            <input
              type="datetime-local"
              value={editForm.paidAt}
              onChange={(e) => setEditForm({...editForm, paidAt: e.target.value})}
              className="w-full px-2 py-1 border rounded text-sm"
              disabled={editForm.status !== 'PAID'}
            />
          ) : (
            payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "N/A"
          )}
        </div>
      ),
    },
    { 
      key: "paystackRef", 
      title: "Reference",
      render: (payment: any) => (
        <div className="min-w-[120px]">
          {editingPayment === payment.id ? (
            <input
              type="text"
              value={editForm.paystackRef}
              onChange={(e) => setEditForm({...editForm, paystackRef: e.target.value})}
              className="w-full px-2 py-1 border rounded text-sm font-mono"
              placeholder="Reference"
            />
          ) : (
            <span className="font-mono text-sm">{payment.paystackRef}</span>
          )}
        </div>
      )
    },
    {
      key: "timestamps",
      title: "Timestamps",
      render: (payment: any) => (
        <div className="text-xs text-gray-600 min-w-[140px]">
          <div>Created: {new Date(payment.createdAt).toLocaleString()}</div>
          {payment.updatedAt !== payment.createdAt && (
            <div>Updated: {new Date(payment.updatedAt).toLocaleString()}</div>
          )}
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (payment: any) => (
        <div className="flex gap-2 min-w-[140px]">
          {editingPayment === payment.id ? (
            <>
              <button
                onClick={() => handleSavePayment(payment.id)}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={12} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
              >
                <X size={12} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEditPayment(payment)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                <Edit size={12} />
                Edit
              </button>
              {payment.status === 'PENDING' && (
                <button
                  onClick={() => handleQuickConfirm(payment)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  <Check size={12} />
                  Confirm
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Payment Oversight | Corpers Drive Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment Oversight</h1>
        <p className="text-gray-600 mt-1">Manage and update payment records</p>
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