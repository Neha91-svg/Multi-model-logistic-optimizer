import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full filter blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -40, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full filter blur-[120px]" 
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 lg:p-12 rounded-[40px] w-full max-w-2xl relative z-10 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6">
                        <UserPlus className="w-8 h-8 text-primary shadow-lg shadow-primary/20" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Create <span className="gradient-text">Account</span></h1>
                    <p className="text-text-muted mt-2">Join the future of smart logistic optimization</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-error/10 border border-error/50 rounded-2xl text-error text-sm mb-8 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-muted ml-1">Full Name</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-text-main"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-muted ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-text-main"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-muted ml-1">Secure Password</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full rounded-2xl py-4 pl-12 pr-4 text-text-main"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-text-muted ml-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Specify Your Role
                        </label>
                        <div className="grid grid-cols-2 gap-6">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
                                    role === 'customer' 
                                    ? 'bg-primary/20 border-primary text-text-main glow-primary' 
                                    : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                <User className={`w-8 h-8 transition-transform ${role === 'customer' ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-xs font-bold uppercase tracking-widest">Customer</span>
                                {role === 'customer' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-full flex items-center justify-center p-1"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('driver')}
                                className={`group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
                                    role === 'driver' 
                                    ? 'bg-primary/20 border-primary text-text-main glow-primary' 
                                    : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                <Shield className={`w-8 h-8 transition-transform ${role === 'driver' ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-xs font-bold uppercase tracking-widest">Driver</span>
                                {role === 'driver' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-full flex items-center justify-center p-1"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 btn-premium mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Create Secure Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
                    <p className="text-sm text-text-muted">
                        Already part of the fleet? 
                        <span 
                            onClick={() => navigate('/login')} 
                            className="text-primary hover:underline cursor-pointer ml-2 font-bold"
                        >
                            Sign In Instead
                        </span>
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-xs text-text-muted hover:text-text-main transition-colors font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
