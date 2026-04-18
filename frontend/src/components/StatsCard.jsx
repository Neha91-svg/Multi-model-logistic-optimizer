import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass p-6 rounded-[32px] relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 blur-2xl rounded-full"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div 
          className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500"
          style={{ boxShadow: `0 10px 20px -5px ${color}33` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="text-right">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">{title}</h3>
            <p className="text-3xl font-extrabold mt-1 tracking-tighter" style={{ color }}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
