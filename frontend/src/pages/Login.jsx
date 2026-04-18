import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-bg-darker overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary rounded-full filter blur-[150px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary rounded-full filter blur-[150px]" 
      />

      <div className="w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Hero Section */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           className="hidden lg:block space-y-8"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Enterprise Grade Security
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight leading-none">
                Optimize Your <br />
                <span className="gradient-text">Logistics</span> Flow.
            </h1>
            <p className="text-xl text-text-muted max-w-md leading-relaxed">
                Experience the next generation of fleet management with AI-driven route optimization and real-time tracking.
            </p>
            <div className="flex items-center gap-6 pt-4">
                <div className="space-y-1">
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Uptime</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="space-y-1">
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Support</p>
                </div>
            </div>
        </motion.div>

        {/* Login Form */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 lg:p-12 rounded-[40px] w-full max-w-md mx-auto relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[40px] pointer-events-none" />
            
            <div className="text-center mb-10 relative">
                <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <LogIn className="w-8 h-8 text-primary shadow-lg shadow-primary/20" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
                <p className="text-text-muted mt-2">Sign in to continue to your dashboard</p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-error/10 border border-error/50 rounded-2xl text-error text-sm mb-8 text-center"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative">
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

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-semibold text-text-muted">Password</label>
                        <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
                    </div>
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

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 btn-premium mt-8"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Log In to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center mt-10 relative">
                <p className="text-sm text-text-muted">
                    New to the platform? <span 
                        onClick={() => navigate('/register')} 
                        className="text-primary hover:underline cursor-pointer font-bold"
                    >
                        Create an account
                    </span>
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
