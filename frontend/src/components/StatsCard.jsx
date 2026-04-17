import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass p-6 rounded-2xl flex items-center gap-6"
    >
      <div className={`p-4 rounded-xl opacity-80`} style={{ backgroundColor: `${color}22` }}>
        <Icon className="w-8 h-8" style={{ color: color }} />
      </div>
      <div>
        <p className="text-text-muted text-sm uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
