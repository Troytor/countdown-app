import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, noPadding = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-panel relative overflow-hidden rounded-3xl ${noPadding ? '' : 'p-5'} transition-shadow hover:shadow-2xl hover:shadow-white/5 cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};
