import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar, 
    ArrowRight, Activity, Package, CheckCircle2, Clock, MousePointer2 
} from 'lucide-react';
import { 
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Analytics = () => {
  const { api } = useAuth();
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, assigned: 0, shipped: 0, delivered: 0, cancelled: 0 },
    weeklyStats: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const res = await api.get('/stats/dashboard');
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const COLORS = {
    pending: 'var(--color-warning)',
    assigned: 'var(--color-info)',
    shipped: 'var(--color-primary)',
    delivered: 'var(--color-success)',
    cancelled: 'var(--color-error)'
  };

  const statusPieData = [
    { name: 'Pending', value: data.stats.pending, color: COLORS.pending },
    { name: 'Assigned', value: data.stats.assigned, color: COLORS.assigned },
    { name: 'Shipped', value: data.stats.shipped, color: COLORS.shipped },
    { name: 'Delivered', value: data.stats.delivered, color: COLORS.delivered },
    { name: 'Cancelled', value: data.stats.cancelled, color: COLORS.cancelled }
  ].filter(item => item.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
                Data <span className="gradient-text italic">Intelligence</span>
            </h1>
            <p className="text-sm text-text-muted font-bold tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              ANALYTICS ENGINE v1.0 • REAL-TIME PERFORMANCE MONITORING
            </p>
          </motion.div>
        </header>

        {/* Top Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 flex items-center gap-6 group hover:border-primary/30 transition-all">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h4 className="text-[10px] text-text-muted uppercase font-black tracking-widest">Efficiency Rating</h4>
                    <p className="text-3xl font-black tracking-tighter">94.2%</p>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 flex items-center gap-6 group hover:border-success/30 transition-all">
                <div className="p-4 bg-success/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div>
                    <h4 className="text-[10px] text-text-muted uppercase font-black tracking-widest">Completion Rate</h4>
                    <p className="text-3xl font-black tracking-tighter">
                        {data.stats.total > 0 ? Math.round((data.stats.delivered / data.stats.total) * 100) : 0}%
                    </p>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 flex items-center gap-6 group hover:border-warning/30 transition-all">
                <div className="p-4 bg-warning/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8 text-warning" />
                </div>
                <div>
                    <h4 className="text-[10px] text-text-muted uppercase font-black tracking-widest">Ongoing Missions</h4>
                    <p className="text-3xl font-black tracking-tighter">{data.stats.pending + data.stats.shipped + data.stats.assigned}</p>
                </div>
            </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bar Chart: Pending vs Delivered */}
          <motion.div variants={itemVariants} className="glass rounded-[48px] p-10 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Status Comparison</h3>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Pending vs Delivered Flow</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyStats}>
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
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15,15,15,0.9)', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      padding: '16px'
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="pending" name="Pending" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" name="Delivered" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart: Status Breakdown */}
          <motion.div variants={itemVariants} className="glass rounded-[48px] p-10 flex flex-col h-[500px]">
             <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <PieChartIcon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Status Distribution</h3>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Total Payload Allocation</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15,15,15,0.9)', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                    }} 
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Area Chart: Order Volume Trend */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-[48px] p-10 h-[450px]">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Mission Throughput</h3>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Order Volume Evolution</p>
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyStats}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
