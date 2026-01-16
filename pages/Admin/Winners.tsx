/**
 * Admin Winners Page
 * 
 * Manage winners for social proof display
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Trophy,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { winners } from '../../mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface WinnerFormData {
  display_name: string;
  location: string;
  prize_name: string;
  prize_value_gbp: string;
  prize_image_url: string;
  is_public: boolean;
  show_in_ticker: boolean;
}

export const AdminWinners: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<WinnerFormData>({
    display_name: '',
    location: '',
    prize_name: '',
    prize_value_gbp: '',
    prize_image_url: '',
    is_public: true,
    show_in_ticker: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call the createWinner hook
    console.log('Creating winner:', formData);
    setShowAddModal(false);
    setFormData({
      display_name: '',
      location: '',
      prize_name: '',
      prize_value_gbp: '',
      prize_image_url: '',
      is_public: true,
      show_in_ticker: true,
    });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-teal-900">Winners</h1>
            <p className="text-stone-500 mt-1">Manage winners for social proof and ticker display</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} className="mr-2" />
            Add Winner
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search winners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-12 pr-4 py-3 bg-white border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner) => (
            <div key={winner.id} className="bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="w-12 h-12 rounded-full object-cover bg-cream-100"
                    />
                    <div>
                      <h3 className="font-bold text-teal-900">{winner.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <MapPin size={12} />
                        {winner.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant="urgent" className="bg-yellow-100 text-yellow-700 border-none">
                    <Trophy size={12} className="mr-1" />
                    Winner
                  </Badge>
                </div>

                <div className="bg-cream-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-stone-400 uppercase font-bold mb-1">Prize Won</p>
                  <p className="font-bold text-teal-900">{winner.prize}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-stone-500">
                    <Calendar size={14} />
                    {winner.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-cream-50 rounded-lg transition">
                      <Eye size={16} className="text-green-500" />
                    </button>
                    <button className="p-2 hover:bg-cream-50 rounded-lg transition">
                      <Edit size={16} className="text-stone-400" />
                    </button>
                    <button className="p-2 hover:bg-cream-50 rounded-lg transition">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Winner Modal */}
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
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-teal-900">Add Winner</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-cream-50 rounded-lg transition"
                >
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah J."
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Manchester"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Prize Name</label>
                  <input
                    type="text"
                    required
                    placeholder="iCandy Peach 7"
                    value={formData.prize_name}
                    onChange={(e) => setFormData({ ...formData, prize_name: e.target.value })}
                    className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Prize Value (£)</label>
                    <input
                      type="number"
                      placeholder="1598"
                      value={formData.prize_value_gbp}
                      onChange={(e) => setFormData({ ...formData, prize_value_gbp: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Prize Image URL</label>
                    <input
                      type="text"
                      placeholder="/images/..."
                      value={formData.prize_image_url}
                      onChange={(e) => setFormData({ ...formData, prize_image_url: e.target.value })}
                      className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-300 text-teal-500 focus:ring-teal-400"
                    />
                    <span className="text-sm text-stone-700">Public on winners page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_in_ticker}
                      onChange={(e) => setFormData({ ...formData, show_in_ticker: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-300 text-teal-500 focus:ring-teal-400"
                    />
                    <span className="text-sm text-stone-700">Show in ticker</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Winner
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

export default AdminWinners;
