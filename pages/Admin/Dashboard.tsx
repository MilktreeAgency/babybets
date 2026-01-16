/**
 * Admin Dashboard
 * 
 * Overview stats and navigation for admin users
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  Ticket, 
  Users, 
  Gift, 
  Tag, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon, link }) => {
  const content = (
    <div className="bg-white rounded-2xl p-6 border border-cream-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
          {icon}
        </div>
        {link && (
          <ArrowUpRight size={18} className="text-stone-300" />
        )}
      </div>
      <p className="text-sm text-stone-500 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-teal-900">{value}</p>
      {change && (
        <p className={`text-sm font-medium mt-2 ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 
          'text-stone-500'
        }`}>
          {change}
        </p>
      )}
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, link, color }) => (
  <Link 
    to={link}
    className={`${color} rounded-2xl p-6 text-white hover:opacity-90 transition-opacity`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <ArrowUpRight size={18} />
    </div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-white/80 text-sm">{description}</p>
  </Link>
);

export const AdminDashboard: React.FC = () => {
  // Mock stats - in production these would come from Supabase
  const stats = {
    totalRevenue: '£12,450',
    revenueChange: '+15% from last month',
    activeCompetitions: 2,
    ticketsSold: 1247,
    ticketsChange: '+234 today',
    totalUsers: 3892,
    newUsersChange: '+89 this week',
    pendingFulfillments: 12,
    walletCreditsIssued: '£2,340',
  };

  const recentActivity = [
    { id: 1, type: 'sale', message: 'Sarah J. purchased 20 tickets', time: '2 mins ago', icon: <Ticket size={16} /> },
    { id: 2, type: 'win', message: 'David M. won iCandy Cocoon', time: '15 mins ago', icon: <Trophy size={16} /> },
    { id: 3, type: 'signup', message: 'New user registered', time: '32 mins ago', icon: <Users size={16} /> },
    { id: 4, type: 'win', message: 'Emma W. won £20 Cash', time: '1 hour ago', icon: <Trophy size={16} /> },
    { id: 5, type: 'fulfillment', message: 'Prize dispatched to James P.', time: '2 hours ago', icon: <Gift size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-teal-900">Admin Dashboard</h1>
            <p className="text-stone-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <Link to="/admin/competitions/new">
            <Button>
              <Gift size={18} className="mr-2" />
              New Competition
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            changeType="positive"
            icon={<TrendingUp size={24} />}
          />
          <StatCard
            title="Active Competitions"
            value={stats.activeCompetitions}
            icon={<Gift size={24} />}
            link="/admin/competitions"
          />
          <StatCard
            title="Tickets Sold"
            value={stats.ticketsSold.toLocaleString()}
            change={stats.ticketsChange}
            changeType="positive"
            icon={<Ticket size={24} />}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={stats.newUsersChange}
            changeType="positive"
            icon={<Users size={24} />}
            link="/admin/users"
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-teal-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickAction
            title="Manage Competitions"
            description="Create, edit and monitor competitions"
            icon={<Gift size={24} />}
            link="/admin/competitions"
            color="bg-gradient-to-br from-teal-500 to-teal-700"
          />
          <QuickAction
            title="Add Winner"
            description="Manually add winners for social proof"
            icon={<Trophy size={24} />}
            link="/admin/winners"
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
          />
          <QuickAction
            title="Promo Codes"
            description="Create and manage discount codes"
            icon={<Tag size={24} />}
            link="/admin/promo-codes"
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <QuickAction
            title="Fulfillments"
            description={`${stats.pendingFulfillments} pending fulfillments`}
            icon={<CheckCircle size={24} />}
            link="/admin/fulfillments"
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-teal-900">Recent Activity</h2>
              <Badge variant="default" className="bg-cream-100 text-stone-600">Live</Badge>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-cream-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'win' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                    activity.type === 'signup' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-teal-900">{activity.message}</p>
                    <p className="text-xs text-stone-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-xl font-bold text-teal-900 mb-6">Pending Tasks</h2>
            <div className="space-y-4">
              <Link to="/admin/fulfillments" className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-teal-900">{stats.pendingFulfillments} Prize Fulfillments</p>
                  <p className="text-sm text-stone-500">Awaiting dispatch or winner response</p>
                </div>
                <ArrowUpRight size={18} className="text-stone-400" />
              </Link>
              
              <Link to="/admin/withdrawals" className="flex items-center gap-4 p-4 bg-cream-50 border border-cream-200 rounded-xl hover:bg-cream-100 transition">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                  <Wallet size={20} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-teal-900">3 Withdrawal Requests</p>
                  <p className="text-sm text-stone-500">Pending review</p>
                </div>
                <ArrowUpRight size={18} className="text-stone-400" />
              </Link>
              
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-teal-900">All competitions healthy</p>
                  <p className="text-sm text-stone-500">No issues detected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
