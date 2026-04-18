import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Shield, ShieldCheck, Key, RefreshCcw, 
    Lock, CheckCircle2, AlertCircle, Camera, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user, api } = useAuth();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setStatus({ type: 'success', message: 'Credentials synchronized successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Synchronization failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-darker pb-20">
            <Navbar />

            <main className="px-8 max-w-7xl mx-auto space-y-12">
                <header>
                    <h1 className="text-5xl font-black tracking-tight leading-none mb-4 font-outfit uppercase">Identity <span className="gradient-text italic">Hub</span></h1>
                    <p className="text-sm text-text-muted font-bold tracking-tight">Security protocols and operator credentials management</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-[48px] p-10 relative overflow-hidden text-center group"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
                            
                            <div className="relative inline-block mb-8">
                                <div className="w-32 h-32 rounded-[40px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <User className="w-16 h-16 opacity-40" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 p-2 bg-success rounded-xl shadow-lg shadow-success/20">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-10">
                                <h2 className="text-3xl font-black tracking-tight">{user?.name}</h2>
                                <p className="text-xs text-text-muted font-black uppercase tracking-[0.3em] font-mono">{user?.role} NODE</p>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-secondary" /> Email Reference
                                    </p>
                                    <p className="text-sm font-bold truncate">{user?.email}</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-primary" /> Clearance Level
                                    </p>
                                    <p className="text-sm font-bold uppercase tracking-widest">Type {user?.role === 'admin' ? '01 (ROOT)' : '03 (FIELD)'}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Security Update Form */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-[48px] p-10 md:p-14 space-y-12"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-secondary/10 rounded-2xl glow-secondary">
                                    <Key className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none">Security <span className="text-secondary italic">Sync</span></h2>
                                    <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-[0.2em]">Update access credentials</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted ml-1">Current Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                            <input 
                                                required
                                                type="password" 
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-text-main focus:border-secondary/50 transition-all font-bold"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted ml-1">New Password</label>
                                        <div className="relative group">
                                            <RefreshCcw className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                            <input 
                                                required
                                                type="password" 
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-text-main focus:border-secondary/50 transition-all font-bold"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted ml-1">Confirm New Password</label>
                                        <div className="relative group md:w-1/2">
                                            <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                            <input 
                                                required
                                                type="password" 
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-text-main focus:border-secondary/50 transition-all font-bold"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {status.message && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-5 rounded-3xl border flex items-center gap-4 ${
                                            status.type === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-error/5 border-error/20 text-error'
                                        }`}
                                    >
                                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                                    </motion.div>
                                )}

                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="px-12 py-5 rounded-3xl bg-secondary hover:bg-secondary-light text-white font-black uppercase tracking-[0.3em] shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                                    Sync Credentials
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
