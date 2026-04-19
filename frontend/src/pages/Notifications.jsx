import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    Bell, Clock, Truck, CheckCircle2, TrendingUp, 
    ArrowRight, Info, Package, AlertCircle, Trash2, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/stats/activities');
      setActivities(res.data.data);
    } catch (error) {
      console.error('Failed to fetch activity logs', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'assigned': return <User className="w-5 h-5 text-primary" />;
      case 'shipped': return <Truck className="w-5 h-5 text-secondary" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-error" />;
      default: return <Package className="w-5 h-5 text-text-muted" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
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
        className="max-w-4xl mx-auto px-8 space-y-12"
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
                Mission <span className="gradient-text italic">Logs</span>
            </h1>
            <p className="text-sm text-text-muted font-bold tracking-tight flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              CENTRAL ACTIVITY OVERLAY • AUDIT TRAIL v1.0
            </p>
          </motion.div>
          
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchActivities}
            className="px-6 py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
          >
            Refresh Intel
          </motion.button>
        </header>

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, idx) => (
              <motion.div 
                key={activity.id}
                variants={itemVariants}
                className="glass rounded-[32px] p-6 flex items-center gap-6 group hover:border-primary/30 hover:bg-white/[0.03] transition-all cursor-pointer"
                onClick={() => navigate(`/orders/${activity.order_id}`)}
              >
                <div className={`p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                  activity.status === 'delivered' ? 'bg-success/10' :
                  activity.status === 'pending' ? 'bg-warning/10' :
                  activity.status === 'cancelled' ? 'bg-error/10' : 'bg-primary/10'
                }`}>
                   {getStatusIcon(activity.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors truncate">
                        {activity.message}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold whitespace-nowrap ml-4">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.time).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-text-muted">
                    <span className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Protocol: MISSION_UPDATE
                    </span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>SYSTIME: {new Date(activity.time).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                    <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-40 flex flex-col items-center justify-center gap-6 opacity-20">
                <AlertCircle className="w-20 h-20" />
                <p className="text-xl font-black uppercase tracking-[0.4em] italic text-center">No recent activity recorded.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
