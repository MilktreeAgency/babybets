/**
 * Admin Withdrawals Panel
 * 
 * Manual approval of withdrawal requests
 * Per PRD Section 5 - Admin manually approves payouts
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  ArrowLeft,
  Banknote,
  User,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';
import { formatCurrency } from '../../utils/pricing';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number; // in pence
  bankDetails: {
    sortCode: string;
    accountNumber: string;
    accountName: string;
  };
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  rejectedAt?: string;
  notes?: string;
}

// Mock data - in production would come from Supabase
const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: 'wd-001',
    userId: 'user-123',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@email.com',
    amount: 5000, // £50
    bankDetails: {
      sortCode: '12-34-56',
      accountNumber: '****4567',
      accountName: 'SARAH JOHNSON',
    },
    status: 'pending',
    requestedAt: '2026-01-19T10:30:00Z',
  },
  {
    id: 'wd-002',
    userId: 'user-456',
    userName: 'James Mitchell',
    userEmail: 'james.m@email.com',
    amount: 12500, // £125
    bankDetails: {
      sortCode: '78-90-12',
      accountNumber: '****8901',
      accountName: 'JAMES MITCHELL',
    },
    status: 'pending',
    requestedAt: '2026-01-18T14:22:00Z',
  },
  {
    id: 'wd-003',
    userId: 'user-789',
    userName: 'Emma Williams',
    userEmail: 'emma.w@email.com',
    amount: 2000, // £20
    bankDetails: {
      sortCode: '34-56-78',
      accountNumber: '****2345',
      accountName: 'EMMA WILLIAMS',
    },
    status: 'approved',
    requestedAt: '2026-01-17T09:15:00Z',
    approvedAt: '2026-01-17T11:30:00Z',
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatusBadge: React.FC<{ status: WithdrawalRequest['status'] }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    pending: <Clock size={12} />,
    approved: <CheckCircle size={12} />,
    paid: <Banknote size={12} />,
    rejected: <XCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase rounded-lg border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const approvedCount = withdrawals.filter(w => w.status === 'approved').length;

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWithdrawals(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: 'approved', approvedAt: new Date().toISOString(), notes: actionNotes }
        : w
    ));
    setSelectedId(null);
    setActionNotes('');
    setIsProcessing(false);
  };

  const handleMarkPaid = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWithdrawals(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: 'paid', paidAt: new Date().toISOString() }
        : w
    ));
    setIsProcessing(false);
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWithdrawals(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: 'rejected', rejectedAt: new Date().toISOString(), notes: actionNotes }
        : w
    ));
    setSelectedId(null);
    setActionNotes('');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin" className="inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 mb-4">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-teal-900">Withdrawal Requests</h1>
              <p className="text-stone-500 mt-1">Manually approve and process payout requests</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                <p className="text-xs text-yellow-600 font-medium">Pending</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-blue-700">{approvedCount}</p>
                <p className="text-xs text-blue-600 font-medium">To Pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Wallet size={20} className="text-teal-600" />
          <p className="text-sm text-teal-800">
            <strong>Paid within 48 hours:</strong> All approved withdrawals should be processed and paid within 48 hours of approval.
          </p>
        </div>

        {/* Withdrawals Table */}
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase">Bank Details</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase">Requested</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-b border-cream-100 hover:bg-cream-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-teal-900">{withdrawal.userName}</p>
                        <p className="text-xs text-stone-400">{withdrawal.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xl font-bold text-teal-900">
                      £{(withdrawal.amount / 100).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600">{withdrawal.bankDetails.accountName}</p>
                    <p className="text-xs text-stone-400">
                      {withdrawal.bankDetails.sortCode} • {withdrawal.bankDetails.accountNumber}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={withdrawal.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Calendar size={14} />
                      {formatDate(withdrawal.requestedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={isProcessing}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedId(withdrawal.id)}
                          >
                            <Eye size={14} />
                          </Button>
                        </>
                      )}
                      {withdrawal.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkPaid(withdrawal.id)}
                          disabled={isProcessing}
                        >
                          Mark as Paid
                        </Button>
                      )}
                      {(withdrawal.status === 'paid' || withdrawal.status === 'rejected') && (
                        <span className="text-sm text-stone-400">
                          {withdrawal.status === 'paid' ? 'Completed' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {withdrawals.length === 0 && (
            <div className="text-center py-16">
              <Wallet size={48} className="mx-auto mb-4 text-stone-300" />
              <p className="text-stone-500">No withdrawal requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
