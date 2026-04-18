import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, Plus, Search, Filter, Shield, Settings, 
    Activity, Battery, Fuel, Gauge, CheckCircle2, 
    AlertCircle, Trash2, Edit3, X, ChevronRight, Weight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Vehicles = () => {
    const { api } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        type: '',
        capacity: '',
        driver_id: ''
    });

    const fetchVehicles = useCallback(async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data.data);
        } catch (error) {
            console.error('Failed to fetch fleet data', error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', formData);
            fetchVehicles();
            setFormData({ type: '', capacity: '', driver_id: '' });
            setIsModalOpen(false);
        } catch (error) {
            alert('Fleet deployment failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const filteredVehicles = vehicles.filter(v => 
        v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-darker">
                <div className="h-12 w-12 border-t-2 border-primary rounded-full animate-spin glow-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-darker pb-20">
            <Navbar />

            <main className="px-8 max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight leading-none mb-4 font-outfit uppercase">Fleet <span className="gradient-text italic">Terminal</span></h1>
                        <p className="text-sm text-text-muted font-bold tracking-tight">Active resource management and asset allocation</p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-premium px-8 py-4 rounded-2xl glow-primary flex items-center gap-3 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-5 h-5" />
                        Deploy Asset
                    </button>
                </header>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search asset ID or type..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-text-main focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVehicles.map((vehicle) => (
                        <motion.div 
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-[40px] p-8 space-y-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Truck className="w-24 h-24 text-primary" />
                            </div>

                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-primary/10 rounded-2xl glow-primary">
                                    <Truck className="w-6 h-6 text-primary" />
                                </div>
                                <span className={`badge px-4 py-1.5 ${vehicle.driver_id ? 'badge-success' : 'badge-warning'}`}>
                                    {vehicle.driver_id ? 'Assigned' : 'Available'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                    {vehicle.type}
                                    <span className="text-[10px] text-text-muted font-mono bg-white/5 px-2 py-0.5 rounded opacity-50 tracking-normal font-bold">
                                        #{vehicle.id.toString().padStart(4, '0')}
                                    </span>
                                </h3>
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-2">Certified Logistic Asset</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Payload Limit</p>
                                    <div className="flex items-center gap-2">
                                        <Weight className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold">{vehicle.capacity} KG</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Operator</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                                        <Settings className="w-4 h-4 text-secondary" />
                                        <span className="truncate">{vehicle.driver_name || 'System Auto'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredVehicles.length === 0 && (
                    <div className="py-20 flex flex-col items-center gap-6 opacity-20">
                        <Truck className="w-20 h-20 stroke-[1]" />
                        <p className="text-xl font-black uppercase tracking-[0.4em] italic">No assets detected.</p>
                    </div>
                )}
            </main>

            {/* Deployment Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-bg-darker/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass w-full max-w-lg rounded-[48px] p-10 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none uppercase">Deploy <span className="text-primary italic">Asset</span></h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-text-muted transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted ml-1">Asset Model / Type</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. Heavy Duty Carrier v2"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-text-main focus:border-primary/50 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted ml-1">Mass Capacity (KG)</label>
                                        <input 
                                            required
                                            type="number" 
                                            placeholder="5000"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-text-main focus:border-primary/50 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-primary hover:bg-primary-light text-white font-black uppercase tracking-[0.2em] py-5 rounded-[24px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    Initialize Protocol
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vehicles;
