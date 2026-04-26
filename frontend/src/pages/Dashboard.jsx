import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Clock, CheckCircle2, Package, Truck, XCircle, 
    TrendingUp, Activity, Star, Calendar, ArrowRight, User, LogOut,
    Plus, Send, Check, Bell, Search, Filter, MoreHorizontal, ChevronRight, ExternalLink
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import CreateOrderModal from '../components/CreateOrderModal';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, api, logout } = useAuth();
  const navigate = useNavigate();
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
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dataRes, ordersRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/orders')
      ]);
      setData(dataRes.data.data);
      setOrders(ordersRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDashboardData();
        setLastRefreshed(new Date());
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-darker">
        <div className="h-12 w-12 border-t-2 border-b-2 border-primary rounded-full animate-spin glow-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-darker pb-20">
      <Navbar />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-8 space-y-12"
      >
        {/* Hero Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
              Operational <span className="gradient-text italic">Intelligence</span>
            </h1>
            <p className="text-sm text-text-muted font-bold tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              MISSION CONTROL ALPHA v2.0 • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                autoRefresh 
                ? 'bg-primary/20 border-primary text-primary glow-primary' 
                : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
              }`}
            >
              <Activity className={`w-3 h-3 ${autoRefresh ? 'animate-pulse' : ''}`} />
              {autoRefresh ? 'Live Feed Active' : 'Enable Live Feed'}
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-premium px-8 py-4 rounded-2xl glow-primary flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all"
            >
              <Plus className="w-5 h-5" />
              Initialize Mission
            </motion.button>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Missions" 
            value={data.stats.total} 
            icon={Package} 
            trend="+12%" 
            color="primary"
          />
          <StatsCard 
            title="In Flight" 
            value={data.stats.shipped + data.stats.assigned} 
            icon={TrendingUp} 
            trend="+5%" 
            color="warning"
          />
          <StatsCard 
            title="Delivered" 
            value={data.stats.delivered} 
            icon={CheckCircle2} 
            trend="+18%" 
            color="success"
          />
          <StatsCard 
            title="Fleet Usage" 
            value="84%" 
            icon={Truck} 
            trend="-2%" 
            color="secondary"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-[48px] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Activity className="w-40 h-40 text-primary" />
            </div>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Logistics Vector</h3>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mt-1">Real-time mission velocity</p>
                </div>
              </div>
              <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:border-primary/50 transition-colors">
                <option>Trailing 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyStats}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900}}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15,15,15,0.9)', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      padding: '16px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Activity/Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="glass rounded-[48px] p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Activity className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
              </div>
              <div className="space-y-8">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                         {activity.type === 'order' ? <Package className="w-4 h-4 text-primary" /> : <Truck className="w-4 h-4 text-secondary" /> }
                      </div>
                      {i < data.recentActivity.length - 1 && <div className="absolute left-1/2 -bottom-8 w-px h-8 bg-white/5 group-hover:bg-primary/20 transition-colors" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-black leading-tight group-hover:text-primary transition-colors">{activity.message}</p>
                      <p className="text-[9px] text-text-muted mt-1 uppercase font-bold tracking-widest">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[48px] p-8 group overflow-hidden relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                <h3 className="text-xl font-black tracking-tight mb-6">Fleet Efficiency</h3>
                <div className="space-y-6">
                    {data.topVehicles.map((v, i) => (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-text-muted">{v.type}</span>
                                <span>{v.usage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${v.usage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-warning'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        </div>

        {/* Operational Terminal (Table) */}
        <motion.section variants={itemVariants} className="glass rounded-[48px] overflow-hidden">
          <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                 <LayoutDashboard className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Operational Terminal</h3>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/orders')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-light transition-colors flex items-center gap-2 group">
                Access Full Logs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-text-muted text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                  <th className="py-6 px-10">Identifier</th>
                  <th className="py-6 px-6">Trajectory Point</th>
                  <th className="py-6 px-6">Payload Status</th>
                  <th className="py-6 px-10 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-mono text-[10px] font-black group-hover:text-primary transition-colors">
                          #{order.id.toString().padStart(4, '0')}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black tracking-tight">{order.pickup}</span>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold mt-1">
                          <ArrowRight className="w-3 h-3 text-primary opacity-50" />
                          {order.delivery}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className={`badge px-4 py-1.5 ${
                        order.status === 'delivered' ? 'badge-success' : 
                        order.status === 'pending' ? 'badge-warning' : 
                        order.status === 'cancelled' ? 'badge-error' : 'badge-info'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                          {order.status === 'assigned' && (
                              <button className="p-4 bg-warning/10 hover:bg-warning text-warning hover:text-white rounded-2xl transition-all border border-warning/20">
                                  <Send className="w-4 h-4" />
                              </button>
                          )}
                          {order.status === 'shipped' && (
                              <button className="p-4 bg-success/10 hover:bg-success text-success hover:text-white rounded-2xl transition-all border border-success/20">
                                  <Check className="w-4 h-4" />
                              </button>
                          )}
                          <button 
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 hover:border-white/20"
                            title="VIEW MISSION INTEL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </motion.div>

      <CreateOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
