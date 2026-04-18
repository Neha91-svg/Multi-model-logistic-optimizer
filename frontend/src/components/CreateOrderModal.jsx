import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Package, MapPin, Weight, Loader2, Sparkles, ChevronRight } from 'lucide-react';

const CreateOrderModal = ({ isOpen, onClose, onSuccess, api }) => {
    const [formData, setFormData] = useState({ pickup: '', delivery: '', weight: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', formData);
            onSuccess();
            onClose();
            setFormData({ pickup: '', delivery: '', weight: '' });
        } catch (error) {
            alert('Failed to create mission protocol');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-darker/60 backdrop-blur-xl"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass w-full max-w-lg rounded-[48px] p-10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-primary/10 rounded-2xl glow-primary">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight leading-none">Initialize <span className="text-primary italic">Mission</span></h2>
                                    <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-[0.2em]">Deployment protocol v4.0</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-text-muted hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Pickup Vector
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-2xl py-5 px-6 text-text-main"
                                    placeholder="Origin Hub Alpha"
                                    value={formData.pickup}
                                    onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Send className="w-3 h-3" /> Delivery Destination
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-2xl py-5 px-6 text-text-main"
                                    placeholder="Destination Node Beta"
                                    value={formData.delivery}
                                    onChange={(e) => setFormData({...formData, delivery: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Weight className="w-3 h-3" /> Payload Mass (KG)
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-2xl py-5 px-6 text-text-main"
                                    placeholder="0.00"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-indigo-600 px-8 py-5 rounded-2xl flex items-center justify-center gap-4 text-white font-black transition-all shadow-2xl shadow-primary/20 btn-premium group"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Commence Distribution
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] text-text-muted text-center mt-6 font-bold uppercase tracking-[0.4em] opacity-40">Secure encryption active during transmission</p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateOrderModal;
