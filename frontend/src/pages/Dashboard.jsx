import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Clock, CheckCircle2, Package, Truck, XCircle, 
    TrendingUp, Activity, Star, Calendar, ArrowRight, User, LogOut,
    Plus, Send, Check, Bell, Search, Filter, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import CreateOrderModal from '../components/CreateOrderModal';

const Dashboard = () => {
  const { user, api, logout } = useAuth();
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, assigned: 0, shipped: 0, delivered: 0, cancelled: 0 },
    weeklyStats: [],
    todayCount: 0,
    topVehicles: [],
    recentActivity: []
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
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
  }, [api]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
        await api.put(`/orders/${orderId}`, { status: newStatus });
        fetchDashboardData();
    } catch (error) {
        alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAutoAssign = async (orderId) => {
    try {
        await api.post(`/orders/${orderId}/assign`);
        fetchDashboardData();
    } catch (error) {
        alert(error.response?.data?.message || 'Failed to assign vehicle');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-darker">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"
        />
      </div>
    );
  }

  const { stats, weeklyStats, todayCount, topVehicles, recentActivity } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-bg-darker pb-20">
      {/* Premium Top Navigation */}
      <nav className="glass sticky top-0 z-50 px-8 py-4 mb-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-primary rounded-xl glow-primary">
                    <Truck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Logistic <span className="text-primary italic">Pro</span></h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Search className="w-4 h-4 text-text-muted" />
                    <input type="text" placeholder="Quick search..." className="bg-transparent border-none text-xs focus:ring-0 w-40" />
                </div>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors relative">
                    <Bell className="w-5 h-5 text-text-muted" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-bold leading-none">{user?.name}</p>
                        <p className="text-[10px] text-text-muted uppercase font-bold mt-1 tracking-widest">{user?.role}</p>
                    </div>
                    <button onClick={logout} className="ml-2 p-1.5 hover:bg-error/10 text-text-muted hover:text-error rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-8 max-w-7xl mx-auto space-y-12"
      >
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-none mb-4">
                Executive <br /><span className="gradient-text">Overview</span>
            </h1>
            <div className="flex items-center gap-4">
                <div className="badge badge-info uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <p className="text-sm text-text-muted font-medium">Real-time logistics synchronization active</p>
            </div>
          </div>
          <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-indigo-600 px-8 py-4 rounded-[20px] flex items-center gap-3 text-white font-bold transition-all shadow-xl shadow-primary/20 btn-premium"
          >
              <div className="p-1 bg-white/20 rounded-lg">
                <Plus className="w-4 h-4" />
              </div>
              Launch New Order
          </button>
        </motion.header>

        {/* Stats Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatsCard title="Total Volume" value={stats.total} icon={Package} color="#6366f1" />
          <StatsCard title="Successful" value={stats.delivered} icon={CheckCircle2} color="#10b981" />
          <StatsCard title="Assigned" value={stats.assigned} icon={Truck} color="#a855f7" />
          <StatsCard title="In Transit" value={stats.shipped} icon={TrendingUp} color="#22d3ee" />
          <StatsCard title="Pending" value={stats.pending} icon={Clock} color="#f59e0b" />
          <StatsCard title="Overdue" value={stats.cancelled} icon={XCircle} color="#ef4444" />
        </motion.section>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.section variants={itemVariants} className="lg:col-span-2 glass rounded-[40px] p-8 h-[450px] flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -mr-32 -mt-32" />
              <div className="flex justify-between items-center mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">System Performance</h2>
                        <p className="text-xs text-text-muted font-medium">Total throughput analysis over 7 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                    <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg">Weekly</button>
                    <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Monthly</button>
                  </div>
              </div>
              <div className="flex-1 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyStats}>
                          <defs>
                              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                              tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {weekday: 'short'})}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                          <Tooltip 
                              cursor={{stroke: '#6366f120', strokeWidth: 2}}
                              contentStyle={{backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}
                              itemStyle={{color: '#6366f1', fontWeight: 800}}
                          />
                          <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a'}} activeDot={{r: 6, fill: '#fff', strokeWidth: 3, stroke: '#6366f1'}} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </motion.section>

          <motion.section variants={itemVariants} className="glass rounded-[40px] p-8 flex flex-col relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary/10 rounded-2xl">
                    <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                    <p className="text-xs text-text-muted font-medium">Auto-synced from fleet</p>
                </div>
              </div>
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {recentActivity.map((activity, idx) => (
                      <div key={activity.id} className="relative pl-8 pb-2 border-l border-white/5 last:border-0 last:pb-0">
                          <div className="absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full bg-secondary glow-secondary shadow-[0_0_10px_var(--secondary)]"></div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-black uppercase tracking-widest text-secondary">#{activity.id}</p>
                                <span className="text-[10px] text-text-muted font-bold opacity-50">
                                    {new Date(activity.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-text-main">Order Synchronized</p>
                            <p className="text-xs text-text-muted mt-1 leading-relaxed">Transitioned to <span className="text-white font-black">{activity.status}</span> by {activity.customer_name}</p>
                          </div>
                      </div>
                  ))}
                  {recentActivity.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 space-y-4">
                          <Activity className="w-12 h-12 stroke-[1]" />
                          <p className="text-sm italic font-medium">Scanning for fresh activity...</p>
                      </div>
                  )}
              </div>
          </motion.section>
        </div>

        {/* Top Vehicles & Today Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.section variants={itemVariants} className="lg:col-span-2 glass rounded-[40px] p-8 overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl">
                        <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Top Performance</h2>
                        <p className="text-xs text-text-muted font-medium">Fleet efficiency ranking</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">Full Fleet Stats</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topVehicles.map((vehicle, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col items-center gap-4 hover:scale-105 transition-all cursor-default relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 bg-amber-500/10 text-amber-500 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <Star className="w-3 h-3 fill-amber-500" />
                          </div>
                          <div className="p-5 bg-primary/10 rounded-full group-hover:bg-primary transition-colors">
                              <Truck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                          </div>
                          <div className="text-center">
                              <p className="text-sm font-black uppercase tracking-wider">{vehicle.type}</p>
                              <div className="w-8 h-1 bg-primary/20 mx-auto my-2 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-2/3" />
                              </div>
                              <p className="text-xs text-text-muted font-bold font-mono uppercase tracking-widest">{vehicle.count} Operations</p>
                          </div>
                      </div>
                  ))}
              </div>
          </motion.section>

          <motion.section variants={itemVariants} className="glass rounded-[40px] p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/20 rounded-2xl">
                    <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-glow">System Health</h2>
                    <p className="text-xs text-text-muted font-medium">Real-time vitals</p>
                </div>
              </div>
              <div className="space-y-8 flex-1">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                        <span className="text-text-muted">Avg. Latency</span>
                        <span className="text-primary tracking-normal">1.4ms</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                        <span className="text-text-muted">Fleet Capacity</span>
                        <span className="text-secondary tracking-normal">92%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="bg-secondary h-full w-[92%] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                        <span className="text-text-muted">Success Rate</span>
                        <span className="text-accent tracking-normal">98.4%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="bg-accent h-full w-[98%] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"></div>
                    </div>
                  </div>
              </div>
              <button className="w-full mt-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-[10px] font-black uppercase tracking-[0.2em] relative group">
                <span className="relative z-10">Export Executive Summary</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
          </motion.section>
        </div>

        {/* Order Management Table */}
        <motion.section variants={itemVariants} className="glass rounded-[40px] overflow-hidden">
          <div className="p-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Active Operations</h2>
                    <p className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest">Monitoring {orders.length} mission-critical deliveries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                  <button className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    <Filter className="w-5 h-5 text-text-muted" />
                  </button>
                  <button className="text-xs text-primary font-black uppercase tracking-[0.1em] px-6 py-3 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary hover:text-white transition-all">Audit Logs</button>
              </div>
          </div>
          <div className="px-8 pb-8 overflow-x-auto">
            <table className="w-full modern-table">
              <thead>
                <tr className="text-text-muted text-[10px] uppercase font-black tracking-widest">
                  <th className="text-left py-6">Mission ID</th>
                  <th className="text-left py-6">Trajectory Route</th>
                  <th className="text-left py-6">Resource Vehicle</th>
                  <th className="text-left py-6">Mission Status</th>
                  <th className="text-right py-6 pr-4">Commands</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="group cursor-default">
                    <td className="py-8">
                        <span className="font-black text-text-main text-sm font-mono opacity-50">#{order.id.toString().padStart(4, '0')}</span>
                    </td>
                    <td className="py-8">
                      <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-text-main font-black">{order.pickup}</span>
                            <div className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <div className="w-8 h-px bg-primary/20" />
                                <ChevronRight className="w-3 h-3 text-primary/40 -ml-1" />
                            </div>
                            <span className="text-text-main font-black">{order.delivery}</span>
                          </div>
                          <span className="badge badge-info text-[9px] opacity-70">{order.weight} KG</span>
                      </div>
                    </td>
                    <td className="py-8">
                      {order.vehicle_type ? (
                          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                              <Truck className="w-4 h-4 text-primary" />
                              <span className="text-xs font-black uppercase text-text-muted">{order.vehicle_type}</span>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 opacity-30 italic text-xs">
                            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                            Awaiting Resource
                          </div>
                      )}
                    </td>
                    <td className="py-8">
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'pending' ? 'badge-warning' :
                        order.status === 'cancelled' ? 'badge-error' :
                        'badge-info'
                      }`}>
                        {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                        {order.status === 'assigned' && <Star className="w-3 h-3" />}
                        {order.status === 'shipped' && <TrendingUp className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-8 text-right pr-4">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                          {order.status === 'pending' && (
                              <button 
                                  onClick={() => handleAutoAssign(order.id)}
                                  title="Init Auto Assign"
                                  className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all border border-primary/20 glow-primary"
                              >
                                  <Truck className="w-4 h-4" />
                              </button>
                          )}
                          {order.status === 'assigned' && (
                              <button 
                                  onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                  title="Execute Shipping"
                                  className="p-3 bg-warning/10 hover:bg-warning text-warning hover:text-white rounded-xl transition-all border border-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                              >
                                  <Send className="w-4 h-4" />
                              </button>
                          )}
                          {order.status === 'shipped' && (
                              <button 
                                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                  title="Confirm Delivery"
                                  className="p-3 bg-success/10 hover:bg-success text-success hover:text-white rounded-xl transition-all border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              >
                                  <Check className="w-4 h-4" />
                              </button>
                          )}
                          <button className="p-3 bg-white/5 hover:bg-white/10 text-text-muted rounded-xl transition-all border border-white/5">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
                <div className="py-20 flex flex-col items-center gap-6 opacity-30">
                    <Package className="w-20 h-20 stroke-[0.5]" />
                    <p className="text-xl font-medium italic">No missions found in current sector.</p>
                </div>
            )}
          </div>
        </motion.section>
      </motion.div>

      <CreateOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDashboardData}
        api={api}
      />
    </div>
  );
};

export default Dashboard;
