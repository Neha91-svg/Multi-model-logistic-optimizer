import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, MapPin, Package, Clock, CheckCircle2, Star, 
    TrendingUp, ArrowLeft, ShieldCheck, Mail, User, 
    Weight, Info, Globe, AlertCircle, Calendar,
    ChevronRight, MoreVertical, ExternalLink, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch mission intel', err);
            setError(err.response?.data?.message || 'Failed to establish connection with mission protocol');
        } finally {
            setLoading(false);
        }
    }, [api, id]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-darker">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-14 w-14 border-t-2 border-primary rounded-full animate-spin glow-primary" />
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] animate-pulse">Establishing Intel Link...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg-darker">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-20 px-4">
                    <div className="glass p-10 rounded-[48px] border-error/20 flex flex-col items-center gap-6 text-center max-w-lg">
                        <AlertCircle className="w-16 h-16 text-error opacity-40" />
                        <h2 className="text-3xl font-black tracking-tight">Access <span className="text-error">Denied</span></h2>
                        <p className="text-text-muted font-bold leading-relaxed">{error}</p>
                        <button 
                            onClick={() => navigate('/orders')}
                            className="btn-premium bg-error/10 hover:bg-error text-error hover:text-white px-8 py-4 rounded-2xl flex items-center gap-3 mt-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Command Center
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const timelineSteps = [
        { status: 'pending', label: 'Mission Initialized', icon: Clock, color: 'var(--color-warning)' },
        { status: 'assigned', label: 'Resource Allocated', icon: Truck, color: 'var(--color-primary)' },
        { status: 'shipped', label: 'Logistics Deployment', icon: TrendingUp, color: 'var(--color-secondary)' },
        { status: 'delivered', label: 'Mission Accomplished', icon: CheckCircle2, color: 'var(--color-success)' }
    ];

    return (
        <div className="min-h-screen bg-bg-darker pb-20">
            <Navbar />

            <main className="px-8 max-w-7xl mx-auto space-y-12">
                {/* Executive Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link 
                            to="/orders" 
                            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] group"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Terminal
                        </Link>
                        <h1 className="text-6xl font-black tracking-tight leading-none">
                            Mission Protocol <br />
                            <span className="text-primary italic font-black font-mono">#{order.id.toString().padStart(4, '0')}</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className={`px-6 py-3 rounded-2xl border font-black uppercase tracking-widest text-xs flex items-center gap-3 ${
                            order.status === 'delivered' ? 'bg-success/5 border-success/20 text-success' :
                            order.status === 'pending' ? 'bg-warning/5 border-warning/20 text-warning' :
                            'bg-primary/5 border-primary/20 text-primary'
                        }`}>
                            <Activity className="w-4 h-4 animate-pulse" />
                            {order.status}
                        </div>
                        <button className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                            <MoreVertical className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Data Hub */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Trajectory Card */}
                        <div className="glass rounded-[48px] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Globe className="w-40 h-40 text-primary" />
                            </div>
                            
                            <div className="flex items-center gap-5 mb-10">
                                <div className="p-4 bg-primary/10 rounded-2xl glow-primary">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight">Trajectory Data</h2>
                                        <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mt-1">Operational route analysis</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/orders/${id}/route`)}
                                        className="px-6 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl border border-primary/20 transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2 group/nav"
                                    >
                                        Launch Tactical Overlay
                                        <ExternalLink className="w-3.5 h-3.5 group-hover/nav:translate-x-1 group-hover/nav:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-10 relative">
                                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/5" />
                                    
                                    <div className="flex gap-6 relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary-glow)] mt-2 shrink-0 z-10" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-2">Origin Node</p>
                                            <h3 className="text-2xl font-black tracking-tight">{order.pickup}</h3>
                                            <p className="text-sm text-text-muted mt-2 font-bold opacity-60">Verified Logistics Hub Alpha</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)] mt-2 shrink-0 z-10" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-2">Target Destination</p>
                                            <h3 className="text-2xl font-black tracking-tight">{order.delivery}</h3>
                                            <p className="text-sm text-text-muted mt-2 font-bold opacity-60">Distribution Terminal Omega</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Total Distance</p>
                                            <p className="text-2xl font-black">{order.distance || '---'} <span className="text-xs text-text-muted uppercase">KM</span></p>
                                        </div>
                                        <div className="p-4 bg-warning/5 rounded-2xl">
                                            <Activity className="w-6 h-6 text-warning" />
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Payload Mass</p>
                                            <p className="text-2xl font-black">{order.weight} <span className="text-xs text-text-muted uppercase">KG</span></p>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-2xl">
                                            <Weight className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resource card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass rounded-[48px] p-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-xl">
                                        <Truck className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">Resource Intel</h3>
                                </div>
                                {order.vehicle_type ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-secondary border border-white/5 shadow-inner">
                                                <Truck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black">{order.vehicle_type}</p>
                                                <p className="text-xs text-text-muted uppercase font-black tracking-widest mt-1">Class-4 Carrier</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-white/5" />
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-text-muted uppercase tracking-widest">Est. Delivery Time</span>
                                            <span className="text-secondary font-black">{order.time}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 flex flex-col items-center justify-center gap-4 opacity-30 text-center">
                                        <AlertCircle className="w-10 h-10" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Resource Allocation</p>
                                    </div>
                                )}
                            </div>

                            <div className="glass rounded-[48px] p-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <User className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">Operator</h3>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-amber-500/5 rounded-[24px] flex items-center justify-center text-amber-500 border border-amber-500/10">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black">{order.driver_name || 'System Auto'}</p>
                                        <p className="text-xs text-text-muted uppercase font-black tracking-widest mt-1">Certified Handler</p>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-white/5" />
                                <div className="flex items-center gap-3">
                                    <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white/5 text-text-muted">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <p className="text-[11px] font-bold text-text-muted truncate">comms-channel-v2@logisticpro.hq</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mission Timeline */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-[48px] p-10 h-full flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Activity className="w-40 h-40 text-secondary" />
                            </div>
                            
                            <div className="flex items-center gap-5 mb-12">
                                <div className="p-4 bg-secondary/10 rounded-2xl glow-secondary">
                                    <Calendar className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Mission Timeline</h2>
                                    <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mt-1">Lifecycle Tracking</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-12 relative z-10 px-2">
                                {timelineSteps.map((step, idx) => {
                                    const historyEntry = order.history?.find(h => h.status === step.status);
                                    const isCompleted = !!historyEntry;
                                    const isCurrent = order.status === step.status;

                                    return (
                                        <div key={idx} className={`flex gap-6 relative group/step ${!isCompleted && 'opacity-30'}`}>
                                            {idx < timelineSteps.length - 1 && (
                                                <div className={`absolute left-[20px] top-10 bottom-[-48px] w-0.5 ${isCompleted ? 'bg-secondary' : 'bg-white/5'}`} />
                                            )}
                                            
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                                                isCompleted ? 'bg-secondary shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 border border-white/10'
                                            }`}>
                                                <step.icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-text-muted'}`} />
                                            </div>

                                            <div className="pt-1 flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className={`font-black uppercase tracking-widest text-xs ${isCompleted ? 'text-white' : 'text-text-muted'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <span className="p-1 bg-secondary rounded-full animate-ping shadow-[0_0_10px_var(--color-secondary-glow)]"></span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-secondary opacity-100' : 'text-text-muted opacity-40'}`}>
                                                        {isCompleted ? step.status : 'Awaiting phase...'}
                                                    </p>
                                                    {historyEntry && (
                                                        <p className="text-[9px] text-text-muted font-black opacity-30 uppercase tracking-widest mt-2">
                                                            SYNCHRONIZED: {new Date(historyEntry.created_at).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button className="w-full mt-10 py-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-[11px] font-black uppercase tracking-[0.3em] group/btn">
                                <span className="group-hover/btn:text-primary transition-colors">Export Mission Audit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetails;
