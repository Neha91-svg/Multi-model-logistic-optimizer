import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Clock, CheckCircle2, Package, Truck, XCircle, 
    TrendingUp, Activity, Star, Calendar, ArrowRight, User
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const { user, api } = useAuth();
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, assigned: 0, shipped: 0, delivered: 0, cancelled: 0 },
    weeklyStats: [],
    todayCount: 0,
    topVehicles: [],
    recentActivity: []
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/orders')
        ]);
        setData(dashRes.data.data);
        setOrders(ordersRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [api]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-darker">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { stats, weeklyStats, todayCount, topVehicles, recentActivity } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-text-muted mt-2">Here's what's happening with your logistics today.</p>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-500" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">Today's Orders</p>
                    <p className="text-lg font-bold">{todayCount}</p>
                </div>
            </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total" value={stats.total} icon={Package} color="#6366f1" />
        <StatsCard title="Delivered" value={stats.delivered} icon={CheckCircle2} color="#10b981" />
        <StatsCard title="Assigned" value={stats.assigned} icon={Truck} color="#a855f7" />
        <StatsCard title="Shipped" value={stats.shipped} icon={TrendingUp} color="#22d3ee" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="#f59e0b" />
        <StatsCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="#ef4444" />
      </section>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 glass rounded-3xl p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Weekly Activity
                </h2>
                <span className="text-xs font-mono text-text-muted bg-white/5 px-2 py-1 rounded">Last 7 Days</span>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyStats}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 10}}
                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {weekday: 'short'})}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc'}}
                            itemStyle={{color: '#6366f1'}}
                        />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>

        <section className="glass rounded-3xl p-6 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-secondary" />
                Recent Activity
            </h2>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {recentActivity.map((activity, idx) => (
                    <div key={activity.id} className="relative pl-6 border-l-2 border-border pb-1 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-darker border-2 border-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        <p className="text-sm font-bold text-text-main">Order #{activity.id} Updated</p>
                        <p className="text-xs text-text-muted mt-1">Status changed to <span className="text-primary">{activity.status}</span></p>
                        <div className="flex items-center gap-2 mt-2">
                            <User className="w-3 h-3 text-text-muted" />
                            <span className="text-[10px] text-text-muted">{activity.customer_name}</span>
                            <span className="text-[10px] text-text-muted ml-auto italic">
                                {new Date(activity.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                ))}
                {recentActivity.length === 0 && (
                    <div className="h-full flex items-center justify-center text-text-muted text-sm italic">
                        No recent activity.
                    </div>
                )}
            </div>
        </section>
      </div>

      {/* Top Vehicles & Today Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 glass rounded-3xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-amber-500" />
                Top Performing Vehicles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topVehicles.map((vehicle, idx) => (
                    <div key={idx} className="bg-white/5 border border-border p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all cursor-default">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Truck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold capitalize">{vehicle.type}</p>
                            <p className="text-xs text-text-muted">{vehicle.count} Orders</p>
                        </div>
                        <div className="ml-auto">
                            <ArrowRight className="w-4 h-4 text-text-muted opacity-30" />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                System Health
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Avg. Delivery Time</span>
                    <span className="font-mono text-text-main">1.4 days</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Fleet Efficiency</span>
                    <span className="font-mono text-text-main">92%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[92%] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-widest">
                Export Reports
            </button>
        </section>
      </div>

      {/* Recent Orders Table */}
      <section className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                Recent Orders
            </h2>
            <button className="text-xs text-primary hover:underline font-bold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-dark text-text-muted text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Pickup</th>
                <th className="p-4 font-semibold">Delivery</th>
                <th className="p-4 font-semibold">Weight</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-text-main">#{order.id}</td>
                  <td className="p-4 text-text-muted text-sm">{order.pickup}</td>
                  <td className="p-4 text-text-muted text-sm">{order.delivery}</td>
                  <td className="p-4 font-mono text-sm">{order.weight} kg</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-text-muted italic">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
