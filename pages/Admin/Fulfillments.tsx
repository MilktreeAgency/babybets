/**
 * Admin Prize Fulfillments Panel
 * 
 * Manage prize claims and fulfillment status
 * Per PRD Section 6 - Admin visibility for prize claims
 */

import React, { useState } from 'react';
import { 
  Gift, 
  Truck, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Banknote,
  Package,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';

interface PrizeFulfillment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  competitionTitle: string;
  prizeName: string;
  prizeValue: number;
  claimType: 'physical' | 'cash';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed';
  address?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    phone: string;
  };
  cashAmount?: number;
  claimedAt: string;
  processedAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
}

// Mock data
const mockFulfillments: PrizeFulfillment[] = [
  {
    id: 'ful-001',
    userId: 'user-123',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@email.com',
    competitionTitle: 'iCandy Mega Mum Bundle',
    prizeName: 'iCandy Peach 7',
    prizeValue: 1549,
    claimType: 'physical',
    status: 'pending',
    address: {
      fullName: 'Sarah Johnson',
      line1: '123 Main Street',
      line2: 'Flat 4',
      city: 'London',
      postcode: 'SW1A 1AA',
      phone: '07700 900123',
    },
    claimedAt: '2026-01-19T10:30:00Z',
  },
  {
    id: 'ful-002',
    userId: 'user-456',
    userName: 'James Mitchell',
    userEmail: 'james.m@email.com',
    competitionTitle: 'iCandy Mega Mum Bundle',
    prizeName: 'iCandy Cocoon Car Seat',
    prizeValue: 599,
    claimType: 'cash',
    status: 'completed',
    cashAmount: 450,
    claimedAt: '2026-01-18T14:22:00Z',
    processedAt: '2026-01-18T14:22:00Z',
  },
  {
    id: 'ful-003',
    userId: 'user-789',
    userName: 'Emma Williams',
    userEmail: 'emma.w@email.com',
    competitionTitle: 'iCandy Mega Mum Bundle',
    prizeName: 'Smyths Toys Voucher £100',
    prizeValue: 100,
    claimType: 'physical',
    status: 'shipped',
    address: {
      fullName: 'Emma Williams',
      line1: '456 High Road',
      city: 'Manchester',
      postcode: 'M1 1AA',
      phone: '07700 900456',
    },
    claimedAt: '2026-01-17T09:15:00Z',
    processedAt: '2026-01-17T11:30:00Z',
    shippedAt: '2026-01-18T09:00:00Z',
    trackingNumber: 'RM123456789GB',
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const StatusBadge: React.FC<{ status: PrizeFulfillment['status'] }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-teal-100 text-teal-800 border-teal-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  const icons = {
    pending: <Clock size={12} />,
    processing: <Package size={12} />,
    shipped: <Truck size={12} />,
    delivered: <CheckCircle size={12} />,
    completed: <CheckCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase rounded-lg border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export const AdminFulfillments: React.FC = () => {
  const [fulfillments, setFulfillments] = useState<PrizeFulfillment[]>(mockFulfillments);
  const [selectedFulfillment, setSelectedFulfillment] = useState<PrizeFulfillment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingCount = fulfillments.filter(f => f.status === 'pending').length;
  const processingCount = fulfillments.filter(f => f.status === 'processing').length;
  const shippedCount = fulfillments.filter(f => f.status === 'shipped').length;

  const handleUpdateStatus = async (id: string, newStatus: PrizeFulfillment['status'], trackingNumber?: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFulfillments(prev => prev.map(f => {
      if (f.id !== id) return f;
      
      const updates: Partial<PrizeFulfillment> = { status: newStatus };
      if (newStatus === 'processing') updates.processedAt = new Date().toISOString();
      if (newStatus === 'shipped') {
        updates.shippedAt = new Date().toISOString();
        updates.trackingNumber = trackingNumber;
      }
      
      return { ...f, ...updates };
    }));
    
    setIsProcessing(false);
    setSelectedFulfillment(null);
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
              <h1 className="text-3xl font-bold font-serif text-teal-900">Prize Fulfillments</h1>
              <p className="text-stone-500 mt-1">Manage prize claims and delivery status</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                <p className="text-xs text-yellow-600 font-medium">Pending</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-blue-700">{processingCount}</p>
                <p className="text-xs text-blue-600 font-medium">Processing</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-purple-700">{shippedCount}</p>
                <p className="text-xs text-purple-600 font-medium">Shipped</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Fulfillments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fulfillments.map((fulfillment) => (
            <div 
              key={fulfillment.id}
              className="bg-white rounded-2xl border border-cream-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    fulfillment.claimType === 'physical' ? 'bg-teal-100 text-teal-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {fulfillment.claimType === 'physical' ? <Gift size={24} /> : <Banknote size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-900">{fulfillment.prizeName}</h3>
                    <p className="text-sm text-stone-500">{fulfillment.competitionTitle}</p>
                  </div>
                </div>
                <StatusBadge status={fulfillment.status} />
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-4 text-sm">
                <User size={14} className="text-stone-400" />
                <span className="text-stone-600">{fulfillment.userName}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-400">{fulfillment.userEmail}</span>
              </div>

              {/* Claim Details */}
              <div className="bg-cream-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 uppercase font-bold mb-1">
                      {fulfillment.claimType === 'physical' ? 'Physical Prize' : 'Cash Alternative'}
                    </p>
                    <p className="text-lg font-bold text-teal-900">
                      {fulfillment.claimType === 'physical' 
                        ? `Worth £${fulfillment.prizeValue.toLocaleString()}`
                        : `£${fulfillment.cashAmount?.toLocaleString()} credited`
                      }
                    </p>
                  </div>
                  <div className="text-right text-sm text-stone-500">
                    <Calendar size={14} className="inline mr-1" />
                    {formatDate(fulfillment.claimedAt)}
                  </div>
                </div>
              </div>

              {/* Address (for physical prizes) */}
              {fulfillment.claimType === 'physical' && fulfillment.address && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase mb-2">
                    <MapPin size={12} />
                    Delivery Address
                  </div>
                  <div className="text-sm text-stone-600 bg-cream-50 p-3 rounded-lg">
                    <p className="font-medium">{fulfillment.address.fullName}</p>
                    <p>{fulfillment.address.line1}</p>
                    {fulfillment.address.line2 && <p>{fulfillment.address.line2}</p>}
                    <p>{fulfillment.address.city}, {fulfillment.address.postcode}</p>
                    <p className="text-stone-400 mt-1">{fulfillment.address.phone}</p>
                  </div>
                </div>
              )}

              {/* Tracking Number */}
              {fulfillment.trackingNumber && (
                <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-bold uppercase mb-1">Tracking Number</p>
                  <p className="font-mono text-purple-800">{fulfillment.trackingNumber}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {fulfillment.status === 'pending' && fulfillment.claimType === 'physical' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(fulfillment.id, 'processing')}
                    disabled={isProcessing}
                  >
                    Mark Processing
                  </Button>
                )}
                {fulfillment.status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const tracking = prompt('Enter tracking number:');
                      if (tracking) {
                        handleUpdateStatus(fulfillment.id, 'shipped', tracking);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    <Truck size={14} className="mr-1" />
                    Mark Shipped
                  </Button>
                )}
                {fulfillment.status === 'shipped' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(fulfillment.id, 'delivered')}
                    disabled={isProcessing}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Mark Delivered
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFulfillment(fulfillment)}
                >
                  <Eye size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {fulfillments.length === 0 && (
          <div className="bg-white rounded-2xl border border-cream-200 p-16 text-center">
            <Gift size={48} className="mx-auto mb-4 text-stone-300" />
            <p className="text-stone-500">No prize claims yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFulfillments;
