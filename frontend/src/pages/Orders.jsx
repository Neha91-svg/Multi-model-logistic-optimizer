import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, Search, Filter, ChevronRight, Eye, Trash2, 
    Clock, CheckCircle2, Star, TrendingUp, X, MapPin, 
    Weight, Truck, Send, Check, AlertCircle, Info, MoreHorizontal, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Orders = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Failed to update mission status');
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Are you sure you want to terminate this mission protocol? This action is irreversible.')) return;
        try {
            await api.delete(`/orders/${orderId}`);
            fetchOrders();
        } catch (error) {
            alert('Failed to terminate mission');
        }
    };

    const handleAutoAssign = async (orderId) => {
        try {
            await api.post(`/orders/${orderId}/assign`);
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign resource');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.delivery.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

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

            <main className="px-8 max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight leading-none mb-4">Operations <span className="gradient-text italic">Terminal</span></h1>
                        <p className="text-sm text-text-muted font-bold tracking-tight">Active mission protocols and trajectory management</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search trajectories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-text-main focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                            />
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-48 bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-10 text-text-main focus:border-primary/50 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                            >
                                <option value="all">Everywhere</option>
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="shipped">In Transit</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </header>

                <section className="glass rounded-[48px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-text-muted text-[10px] uppercase font-black tracking-[0.3em] border-b border-white/5">
                                    <th className="text-left py-8 px-10">Mission</th>
                                    <th className="text-left py-8 px-6">Trajectory Flow</th>
                                    <th className="text-left py-8 px-6">Mass (KG)</th>
                                    <th className="text-left py-8 px-6">Vector Status</th>
                                    <th className="text-right py-8 px-10">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors relative">
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-mono text-xs font-black text-text-muted">
                                                    #{order.id.toString().padStart(4, '0')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-6">
                                            <div className="flex items-center gap-4 text-[13px]">
                                                <div className="flex flex-col">
                                                    <span className="text-text-main font-black tracking-tight">{order.pickup}</span>
                                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-50">Origin Node</span>
                                                </div>
                                                <div className="flex items-center mx-2 opacity-30">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <div className="w-8 h-px bg-primary/50" />
                                                    <ChevronRight className="w-3 h-3 text-primary -ml-1" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-text-main font-black tracking-tight">{order.delivery}</span>
                                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-50">Target Destination</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-6">
                                            <span className="badge badge-info bg-white/5 border-white/10 text-[10px] font-mono opacity-80">{order.weight}</span>
                                        </td>
                                        <td className="py-8 px-6">
                                            <span className={`badge px-4 py-1.5 ${
                                                order.status === 'delivered' ? 'badge-success' :
                                                order.status === 'pending' ? 'badge-warning' :
                                                order.status === 'cancelled' ? 'badge-error' :
                                                'badge-info'
                                            }`}>
                                                {order.status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                                {order.status === 'assigned' && <Star className="w-3.5 h-3.5" />}
                                                {order.status === 'shipped' && <TrendingUp className="w-3.5 h-3.5" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-8 px-10 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5"
                                                    title="View Intel"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/orders/${order.id}/route`)}
                                                    className="p-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white rounded-xl transition-all border border-secondary/20"
                                                    title="Tactical Map"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Conditional Flow Buttons */}
                                                {order.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleAutoAssign(order.id)}
                                                        className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all border border-primary/20"
                                                        title="Auto Assign Resource"
                                                    >
                                                        <Truck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {order.status === 'assigned' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                                        className="p-3 bg-warning/10 hover:bg-warning text-warning hover:text-white rounded-xl transition-all border border-warning/20"
                                                        title="Execute Launch"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                                        className="p-3 bg-success/10 hover:bg-success text-success hover:text-white rounded-xl transition-all border border-success/20"
                                                        title="Confirm Arrival"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-3 bg-error/10 hover:bg-error text-error hover:text-white rounded-xl transition-all border border-error/20"
                                                    title="Terminate Protocol"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="py-32 flex flex-col items-center gap-6 opacity-20">
                                <Package className="w-20 h-20 stroke-[1]" />
                                <p className="text-xl font-black uppercase tracking-[0.4em] italic">No trajectories match your filter.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* View Detail Modal */}
            <AnimatePresence>
                {isViewModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsViewModalOpen(false)}
                            className="absolute inset-0 bg-bg-darker/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass w-full max-w-2xl rounded-[48px] p-10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                            
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-primary/10 rounded-2xl glow-primary">
                                        <Info className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight leading-none">Intelligence <span className="text-primary italic">Protocol</span></h2>
                                        <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-[0.2em]">Mission Data Access Layer</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-text-muted transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-primary" /> Trajectory Route
                                        </p>
                                        <div className="space-y-6 relative pl-4 border-l-2 border-white/5 py-2 mt-4 ml-1">
                                            <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary-glow)]" />
                                            <div className="absolute bottom-0 left-[-7px] w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary-glow)]" />
                                            <div>
                                                <p className="text-xs font-black uppercase text-text-muted tracking-widest mb-1 opacity-50">Origin Node</p>
                                                <p className="text-lg font-black text-text-main">{selectedOrder.pickup}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-text-muted tracking-widest mb-1 opacity-50">Target Destination</p>
                                                <p className="text-lg font-black text-text-main">{selectedOrder.delivery}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Payload Mass</p>
                                            <div className="flex items-center gap-2">
                                                <Weight className="w-4 h-4 text-primary" />
                                                <span className="text-xl font-bold">{selectedOrder.weight} KG</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Distance</p>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-warning" />
                                                <span className="text-xl font-bold">{selectedOrder.distance || '---'} KM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
                                            <Truck className="w-3 h-3 text-secondary" /> Asset Allocation
                                        </p>
                                        <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center gap-4 group">
                                            {selectedOrder.vehicle_type ? (
                                                <>
                                                    <div className="p-5 bg-secondary/10 rounded-full group-hover:bg-secondary group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all">
                                                        <Truck className="w-10 h-10 text-secondary group-hover:text-white transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black uppercase tracking-tight">{selectedOrder.vehicle_type}</p>
                                                        <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-2">Active Resource</p>
                                                    </div>
                                                    <div className="w-full h-px bg-white/5 my-2" />
                                                    <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <span className="text-text-muted">Estimated Time</span>
                                                        <span className="text-secondary">{selectedOrder.time}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-10 flex flex-col items-center gap-4 opacity-30">
                                                    <AlertCircle className="w-12 h-12" />
                                                    <p className="text-xs font-black uppercase tracking-[0.2em]">Awaiting Allocation</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Current Vector Status</p>
                                        <div className={`p-5 rounded-3xl border flex items-center justify-between font-black uppercase tracking-widest text-[11px] ${
                                            selectedOrder.status === 'delivered' ? 'bg-success/5 border-success/20 text-success' :
                                            selectedOrder.status === 'pending' ? 'bg-warning/5 border-warning/20 text-warning' :
                                            'bg-primary/5 border-primary/20 text-primary'
                                        }`}>
                                            <span>{selectedOrder.status}</span>
                                            {selectedOrder.status === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
