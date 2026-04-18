import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass p-6 rounded-[32px] glass-hover flex flex-col items-center justify-center text-center gap-4 group relative overflow-hidden"
    >
      <div 
        className="p-4 rounded-2xl transition-all duration-500 group-hover:shadow-[0_0_25px_var(--color-primary-glow)] relative z-10"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-1">{title}</p>
        <h3 className="text-3xl font-black tracking-tight text-text-main group-hover:text-primary transition-colors">{value}</h3>
      </div>
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
      {/* Decorative inner glow */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-5 transition-opacity"
        style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
      />
    </motion.div>
  );
};

export default StatsCard;
