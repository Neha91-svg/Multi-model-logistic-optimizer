import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Clock, CheckCircle2, Package, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/orders')
        ]);
        setStats(statsRes.data.data);
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-text-muted mt-2">Here's what's happening with your logistics today.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Orders" value={stats.total} icon={Package} color="#6366f1" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="#f59e0b" />
        <StatsCard title="Delivered" value={stats.delivered} icon={CheckCircle2} color="#10b981" />
        <StatsCard title="Assigned" value={stats.assigned} icon={Truck} color="#a855f7" />
        <StatsCard title="Shipped" value={stats.shipped} icon={Truck} color="#22d3ee" />
        <StatsCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="#ef4444" />
      </section>

      <section className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                Recent Orders
            </h2>
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
                <th className="p-4 font-semibold">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-text-main">#{order.id}</td>
                  <td className="p-4 text-text-muted">{order.pickup}</td>
                  <td className="p-4 text-text-muted">{order.delivery}</td>
                  <td className="p-4 font-mono">{order.weight} kg</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted">{order.vehicle_type || 'N/A'}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-text-muted">
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
