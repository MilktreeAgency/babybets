/**
 * Admin Promo Codes Page
 * 
 * Create and manage discount codes
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  Tag,
  Percent,
  Hash,
  Calendar,
  X,
  Check
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_value' | 'free_tickets';
  value: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  valid_until: string | null;
}

// Mock promo codes
const mockPromoCodes: PromoCode[] = [
  { id: '1', code: 'BABY10', type: 'percentage', value: 10, max_uses: null, current_uses: 234, is_active: true, valid_until: null },
  { id: '2', code: 'BABY15', type: 'percentage', value: 15, max_uses: null, current_uses: 156, is_active: true, valid_until: null },
  { id: '3', code: 'WELCOME', type: 'percentage', value: 10, max_uses: null, current_uses: 892, is_active: true, valid_until: null },
  { id: '4', code: 'FIVER', type: 'fixed_value', value: 500, max_uses: 100, current_uses: 45, is_active: true, valid_until: '2026-02-28' },
  { id: '5', code: 'TENOFF', type: 'fixed_value', value: 1000, max_uses: 50, current_uses: 12, is_active: true, valid_until: '2026-02-28' },
];

interface PromoCodeFormData {
  code: string;
  type: 'percentage' | 'fixed_value' | 'free_tickets';
  value: string;
  max_uses: string;
  valid_until: string;
}

export const AdminPromoCodes: React.FC = () => {
  const [promoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<PromoCodeFormData>({
    code: '',
    type: 'percentage',
    value: '',
    max_uses: '',
    valid_until: '',
  });

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeLabel = (type: PromoCode['type'], value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}% off`;
      case 'fixed_value':
        return `£${(value / 100).toFixed(2)} off`;
      case 'free_tickets':
        return `${value} free tickets`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating promo code:', formData);
    setShowAddModal(false);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      max_uses: '',
      valid_until: '',
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-teal-900">Promo Codes</h1>
            <p className="text-stone-500 mt-1">Create and manage discount codes</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} className="mr-2" />
            New Code
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-12 pr-4 py-3 bg-white border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>

        {/* Codes Table */}
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Code</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Discount</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Uses</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Expires</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-cream-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-900 bg-cream-50 px-3 py-1 rounded-lg">
                          {code.code}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(code.code)}
                          className="p-1 hover:bg-cream-100 rounded transition"
                          title="Copy code"
                        >
                          <Copy size={14} className="text-stone-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-600">
                        {code.type === 'percentage' ? (
                          <Percent size={16} className="text-purple-500" />
                        ) : code.type === 'fixed_value' ? (
                          <Tag size={16} className="text-green-500" />
                        ) : (
                          <Hash size={16} className="text-blue-500" />
                        )}
                        <span className="capitalize">{code.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-teal-900">
                        {getTypeLabel(code.type, code.value)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-stone-600">
                        {code.current_uses}{code.max_uses ? ` / ${code.max_uses}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {code.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <Check size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {code.valid_until ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(code.valid_until).toLocaleDateString('en-GB')}
                        </div>
                      ) : (
                        <span className="text-stone-400">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-cream-100 rounded-lg transition" title="Edit">
                          <Edit size={16} className="text-stone-400" />
                        </button>
                        <button className="p-2 hover:bg-cream-100 rounded-lg transition" title="Delete">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Promo Code Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-teal-900">New Promo Code</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-cream-50 rounded-lg transition"
                >
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="SUMMER20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed_value">Fixed Value (£)</option>
                    <option value="free_tickets">Free Tickets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                    {formData.type === 'percentage' ? 'Percentage (%)' : 
                     formData.type === 'fixed_value' ? 'Amount (£)' : 
                     'Number of Tickets'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={formData.type === 'percentage' ? '10' : formData.type === 'fixed_value' ? '5.00' : '2'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Max Uses (optional)</label>
                    <input
                      type="number"
                      placeholder="Unlimited"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Expires (optional)</label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Code
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPromoCodes;
