import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Truck, LogOut, Bell, Search, LayoutDashboard, Package, User, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Fleet', path: '/vehicles', icon: Truck },
        { name: 'Profile', path: '/profile', icon: User }
    ];

    return (
        <nav className="glass sticky top-0 z-50 px-8 py-4 mb-10 border-b border-white/5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="p-2.5 bg-primary rounded-xl glow-primary group-hover:scale-110 transition-transform">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Logistic <span className="text-primary italic">Pro</span></h2>
                </div>
                
                <div className="flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px]
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'text-text-muted hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-6">
                        <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors relative group">
                            <Bell className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary-glow)]" />
                        </button>
                        
                        <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-xs text-white shadow-lg group-hover:scale-105 transition-transform">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[11px] font-black leading-none">{user?.name}</p>
                                <p className="text-[9px] text-text-muted uppercase font-bold mt-1 tracking-widest">{user?.role}</p>
                            </div>
                            <button onClick={logout} className="ml-2 p-1.5 hover:bg-error/10 text-text-muted hover:text-error rounded-lg transition-colors">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
