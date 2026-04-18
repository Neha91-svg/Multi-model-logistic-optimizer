import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, Weight, Loader2, Plus, ArrowRight, Zap } from 'lucide-react';

const CreateOrderModal = ({ isOpen, onClose, onSuccess, api }) => {
    const [formData, setFormData] = useState({
        pickup: '',
        delivery: '',
        weight: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/orders', formData);
            onSuccess();
            onClose();
            setFormData({ pickup: '', delivery: '', weight: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-darker/90 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="glass relative w-full max-w-xl rounded-[40px] p-10 lg:p-12 shadow-2xl z-10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap className="w-40 h-40 text-primary" />
                        </div>

                        <header className="flex justify-between items-start mb-10 relative">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-2xl glow-primary">
                                    <Package className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none">New <span className="gradient-text italic">Mission</span></h2>
                                    <p className="text-xs text-text-muted mt-2 font-bold uppercase tracking-widest">Initialize delivery trajectory</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-3 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/5"
                            >
                                <X className="w-6 h-6 text-text-muted" />
                            </button>
                        </header>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-error/10 border border-error/50 rounded-2xl text-error text-sm mb-8 text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> Origin
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-2xl py-4 px-6 text-text-main"
                                        placeholder="Traj-Center Alpha"
                                        value={formData.pickup}
                                        onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-secondary" /> Destination
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-2xl py-4 px-6 text-text-main"
                                        placeholder="Traj-Center Beta"
                                        value={formData.delivery}
                                        onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest flex items-center gap-2">
                                    <Weight className="w-4 h-4 text-accent" /> Payload Mass (KG)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    step="0.1"
                                    className="w-full rounded-2xl py-4 px-6 text-text-main"
                                    placeholder="000.00"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-indigo-600 active:scale-95 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 btn-premium mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Authorize Mission
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateOrderModal;
