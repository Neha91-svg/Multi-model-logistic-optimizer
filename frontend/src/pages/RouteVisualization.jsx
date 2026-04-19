import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, MapPin, Navigation, Info, ArrowLeft, 
    Activity, Globe, Maximize2, Crosshair, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RouteVisualization = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data);
        } catch (error) {
            console.error('Failed to fetch trajectory data', error);
        } finally {
            setLoading(false);
        }
    }, [api, id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-darker">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-14 w-14 border-t-2 border-primary rounded-full animate-spin glow-primary" />
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] animate-pulse">Initializing Tactical Overlay...</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    // Generate deterministic coordinates based on order ID for a stylized map
    const generateCoords = (seed) => {
        const x = (seed * 13) % 400 + 100;
        const y = (seed * 7) % 300 + 50;
        return { x, y };
    };

    const origin = generateCoords(parseInt(id));
    const target = generateCoords(parseInt(id) + 50);

    return (
        <div className="min-h-screen bg-bg-darker pb-20 overflow-hidden">
            <Navbar />

            <main className="px-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-180px)] space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(`/orders/${id}`)}
                            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] group"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Mission Intel
                        </button>
                        <h1 className="text-5xl font-black tracking-tight leading-none uppercase">
                            Tactical <span className="gradient-text italic">Trajectory</span>
                        </h1>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">Signal Strength</p>
                                <p className="text-xs font-black uppercase tracking-widest text-success">Optimal [98%]</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex gap-8">
                    {/* Main Tactical Display */}
                    <div className="flex-1 glass rounded-[48px] relative overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_70%)]" />
                        
                        {/* Map Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Tactical SVG Map */}
                        <div className="flex-1 relative z-10 flex items-center justify-center p-20">
                            <svg className="w-full h-full max-w-4xl" viewBox="0 0 600 400">
                                {/* Path Connection */}
                                <motion.path
                                    d={`M ${origin.x} ${origin.y} L ${target.x} ${target.y}`}
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    strokeDasharray="8,8"
                                    fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                                
                                {/* Active Vector Line */}
                                <motion.path
                                    d={`M ${origin.x} ${origin.y} L ${target.x} ${target.y}`}
                                    stroke="var(--color-primary)"
                                    strokeWidth="4"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                                    style={{ filter: 'drop-shadow(0 0 8px var(--color-primary))' }}
                                />

                                {/* Origin Node */}
                                <g transform={`translate(${origin.x}, ${origin.y})`}>
                                    <motion.circle
                                        r="20"
                                        fill="var(--color-primary)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.6 }}
                                        fillOpacity="0.1"
                                    />
                                    <circle r="6" fill="var(--color-primary)" className="glow-primary" />
                                    <text y="-25" textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest fill-text-muted">Origin Node</text>
                                </g>

                                {/* Target Node */}
                                <g transform={`translate(${target.x}, ${target.y})`}>
                                    <motion.circle
                                        r="20"
                                        fill="var(--color-secondary)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.6, delay: 1.5 }}
                                        fillOpacity="0.1"
                                    />
                                    <circle r="6" fill="var(--color-secondary)" className="glow-secondary" />
                                    <text y="-25" textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest fill-text-muted">Terminal Point</text>
                                </g>

                                {/* Progress/Marker if Shipped */}
                                {order.status === 'shipped' && (
                                    <motion.g
                                        initial={{ offset: 0 }}
                                        animate={{ offset: 1 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    >
                                        <motion.circle
                                            r="4"
                                            fill="white"
                                            style={{
                                                motionPath: `M ${origin.x} ${origin.y} L ${target.x} ${target.y}`
                                            }}
                                        />
                                    </motion.g>
                                )}
                            </svg>
                        </div>

                        {/* Tactical Overlay Controls */}
                        <div className="absolute bottom-10 left-10 flex gap-4 z-20">
                            <button className="p-4 glass hover:bg-white/10 rounded-2xl transition-all">
                                <Maximize2 className="w-5 h-5 text-text-muted" />
                            </button>
                            <button className="p-4 glass hover:bg-white/10 rounded-2xl transition-all">
                                <Crosshair className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>

                        {/* Scanning Animation */}
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Operational Sidebar */}
                    <div className="w-96 space-y-6">
                        <div className="glass rounded-[40px] p-8 space-y-10">
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">Operational Status</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--color-success-glow)]" />
                                    <h2 className="text-2xl font-black uppercase tracking-tight">{order.status}</h2>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        <span>Current Trajectory</span>
                                        <span>Verified</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '60%' : '15%' }}
                                            transition={{ duration: 1.5, delay: 1 }}
                                            className="h-full bg-primary glow-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Distance</p>
                                        <p className="text-xl font-black">{order.distance || '---'}</p>
                                        <p className="text-[8px] font-bold text-text-muted uppercase mt-1">Kilometers</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Arrival</p>
                                        <p className="text-xl font-black">{order.time?.split(' ')[0] || '--'}</p>
                                        <p className="text-[8px] font-bold text-text-muted uppercase mt-1">{order.time?.split(' ').slice(1).join(' ') || 'Estimated'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Origin Node Intel</p>
                                        <p className="text-xs font-black tracking-tight leading-normal">{order.pickup}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                        <Navigation className="w-4 h-4 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Terminal Objective</p>
                                        <p className="text-xs font-black tracking-tight leading-normal">{order.delivery}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-[40px] p-8 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-secondary/10 rounded-xl">
                                    <Activity className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight italic">Mission Vector</h3>
                             </div>
                             <p className="text-[10px] leading-relaxed text-text-muted font-bold">
                                Trajectory calculation verified by LogisticPro Neural Engine. All operational parameters within optimal range for class-A delivery protocol.
                             </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RouteVisualization;
