import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Shield, Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register({ name, email, password, role });
        if (!result.success) {
            setError(result.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-darker overflow-hidden py-12 px-4 relative">
            {/* Background Decorations */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -40, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" 
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 lg:p-12 rounded-[40px] w-full max-w-2xl relative z-10 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6 shadow-xl shadow-primary/5">
                        <UserPlus className="w-8 h-8 text-primary shadow-lg shadow-primary/20" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight leading-none mb-2">Create <span className="gradient-text italic">Account</span></h1>
                    <p className="text-text-muted text-sm font-medium">Join the next-gen logistics operational fleet</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-error/10 border border-error/50 rounded-2xl text-error text-sm mb-8 text-center font-bold"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest">Full Name</label>
                            <div className="relative group/input">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-2xl py-4 pl-14 pr-6 text-text-main transition-all"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-2xl py-4 pl-14 pr-6 text-text-main transition-all"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest">Secure Credentials</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full rounded-2xl py-4 pl-14 pr-6 text-text-main transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Designate Sector Role
                        </label>
                        <div className="grid grid-cols-2 gap-6">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
                                    role === 'customer' 
                                    ? 'bg-primary/20 border-primary text-text-main shadow-[0_0_20px_var(--color-primary-glow)]' 
                                    : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10'
                                }`}
                            >
                                <User className={`w-8 h-8 transition-transform duration-500 ${role === 'customer' ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Customer</span>
                                {role === 'customer' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-full flex items-center justify-center p-1"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('driver')}
                                className={`group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
                                    role === 'driver' 
                                    ? 'bg-primary/20 border-primary text-text-main shadow-[0_0_20px_var(--color-primary-glow)]' 
                                    : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10'
                                }`}
                            >
                                <Shield className={`w-8 h-8 transition-transform duration-500 ${role === 'driver' ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Driver</span>
                                {role === 'driver' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-full flex items-center justify-center p-1"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-indigo-600 active:scale-[0.98] text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 btn-premium mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Initialize Account Profile
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                    <p className="text-sm text-text-muted">
                        Already part of the fleet? 
                        <span 
                            onClick={() => navigate('/login')} 
                            className="text-primary hover:underline cursor-pointer ml-2 font-bold"
                        >
                            Return to Login
                        </span>
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-[10px] text-text-muted hover:text-text-main transition-colors font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Operational terminal
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
