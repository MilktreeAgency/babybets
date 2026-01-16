/**
 * Admin Competitions Page
 * 
 * List and manage all competitions
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Zap,
  Calendar,
  Ticket
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { competitions } from '../../mockData';

export const AdminCompetitions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter competitions
  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      draft: 'bg-stone-100 text-stone-600',
      scheduled: 'bg-blue-100 text-blue-700',
      ending_soon: 'bg-yellow-100 text-yellow-700',
      sold_out: 'bg-purple-100 text-purple-700',
      closed: 'bg-stone-100 text-stone-500',
      completed: 'bg-teal-100 text-teal-700',
    };
    return styles[status] || 'bg-stone-100 text-stone-600';
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-teal-900">Competitions</h1>
            <p className="text-stone-500 mt-1">Manage all competitions and instant win prizes</p>
          </div>
          <Link to="/admin/competitions/new">
            <Button>
              <Plus size={18} className="mr-2" />
              New Competition
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="sold_out">Sold Out</option>
            <option value="closed">Closed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Competitions Table */}
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Competition</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Tickets</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">End Date</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredCompetitions.map((comp) => (
                  <tr key={comp.id} className="hover:bg-cream-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={comp.image} 
                          alt={comp.title}
                          className="w-14 h-14 rounded-xl object-cover bg-cream-100"
                        />
                        <div>
                          <p className="font-bold text-teal-900">{comp.title}</p>
                          <p className="text-sm text-stone-500">£{(comp.totalValueGBP || comp.retailValueGBP).toLocaleString()} value</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(comp.status)}`}>
                        {comp.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {comp.instantWin ? (
                        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-1 rounded-lg text-sm font-medium">
                          <Zap size={14} fill="currentColor" /> Instant Win
                        </span>
                      ) : (
                        <span className="text-stone-500 text-sm">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-stone-400" />
                        <span className="text-teal-900 font-medium">
                          {comp.ticketsSold} / {comp.maxTickets}
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-cream-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(comp.ticketsSold / comp.maxTickets) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Calendar size={16} />
                        {new Date(comp.drawDateTime).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/competitions/${comp.slug}`}>
                          <button className="p-2 hover:bg-cream-100 rounded-lg transition" title="View">
                            <Eye size={18} className="text-stone-400" />
                          </button>
                        </Link>
                        <Link to={`/admin/competitions/${comp.id}/edit`}>
                          <button className="p-2 hover:bg-cream-100 rounded-lg transition" title="Edit">
                            <Edit size={18} className="text-stone-400" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-cream-100 rounded-lg transition" title="Duplicate">
                          <Copy size={18} className="text-stone-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">No competitions found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompetitions;
