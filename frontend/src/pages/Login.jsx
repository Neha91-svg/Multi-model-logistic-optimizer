import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, ArrowRight, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-bg-darker">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-drift" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-drift" style={{ animationDelay: '-5s' }} />

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:flex flex-col space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">The Future of Logistics</span>
                    </div>
                    
                    <h1 className="text-7xl font-black leading-none tracking-tight">
                        Optimize Your <br />
                        <span className="gradient-text italic">Global Fleet.</span>
                    </h1>
                    
                    <p className="text-xl text-text-muted max-w-md leading-relaxed">
                        Harness the power of multi-model AI to streamline your logistics, automate assignments, and track assets in real-time.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        {[
                            { icon: ShieldCheck, label: "Secure Protocols", sub: "Enterprise Grade" },
                            { icon: Globe, label: "Global Routing", sub: "Multi-Model AI" }
                        ].map((item, i) => (
                            <div key={i} className="glass p-6 rounded-3xl group transition-all duration-500 hover:bg-white/10">
                                <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-bold text-lg">{item.label}</h3>
                                <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-widest">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 lg:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6 shadow-xl shadow-primary/5">
                            <LogIn className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Welcome <span className="text-primary italic">Back</span></h2>
                        <p className="text-text-muted text-sm font-medium">Access your logistics operational terminal</p>
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
                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-2xl py-4 pl-14 pr-6 text-text-main"
                                    placeholder="operator@logisticpro.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-muted ml-2 uppercase tracking-widest">Secure Credentials</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full rounded-2xl py-4 pl-14 pr-6 text-text-main"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-indigo-600 active:scale-[0.98] text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 btn-premium mt-10"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Authorize Access
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                        <p className="text-sm text-text-muted">
                            New to the fleet? 
                            <span 
                                onClick={() => navigate('/register')} 
                                className="text-primary hover:underline cursor-pointer ml-2 font-bold"
                            >
                                Commandeer an Account
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
