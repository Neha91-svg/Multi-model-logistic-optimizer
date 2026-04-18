import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, Weight, Loader2, Plus } from 'lucide-react';

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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass relative w-full max-w-lg rounded-3xl p-8 shadow-2xl z-10"
                    >
                        <header className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Create New <span className="gradient-text">Order</span></h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-text-muted" />
                            </button>
                        </header>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm mb-6 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted ml-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Pickup Address
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                    placeholder="Enter origin address"
                                    value={formData.pickup}
                                    onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted ml-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Delivery Address
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                    placeholder="Enter destination address"
                                    value={formData.delivery}
                                    onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted ml-1 flex items-center gap-2">
                                    <Weight className="w-4 h-4" /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    step="0.1"
                                    className="w-full bg-white/5 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                    placeholder="0.0"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Create Order
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
