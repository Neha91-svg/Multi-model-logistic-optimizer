import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Shield, Loader2, ArrowLeft } from 'lucide-react';
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
        <div className="flex min-h-screen items-center justify-center bg-bg-darker overflow-hidden py-12 px-4">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary opacity-20 filter blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary opacity-20 filter blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                        <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create <span className="gradient-text">Account</span></h1>
                    <p className="text-text-muted mt-2">Join the future of logistic optimization</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-text-main"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted ml-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                                    role === 'customer' 
                                    ? 'bg-primary/20 border-primary text-primary' 
                                    : 'bg-white/5 border-border text-text-muted hover:border-primary/50'
                                }`}
                            >
                                <User className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('driver')}
                                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                                    role === 'driver' 
                                    ? 'bg-primary/20 border-primary text-primary' 
                                    : 'bg-white/5 border-border text-text-muted hover:border-primary/50'
                                }`}
                            >
                                <Shield className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase">Driver</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-indigo-600 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
                    <p className="text-sm text-text-muted">
                        Already have an account? 
                        <span 
                            onClick={() => navigate('/login')} 
                            className="text-primary hover:underline cursor-pointer ml-1 font-semibold"
                        >
                            Log In
                        </span>
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
