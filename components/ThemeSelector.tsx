import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Theme, ThemeId } from '../types';
import { THEMES } from '../utils';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelect: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelect, onClose }) => {
  return (
    <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <motion.div 
         className="bg-[#1c1c1e] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden pointer-events-auto border border-white/10 shadow-2xl p-6 pb-12"
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Choose Theme</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {THEMES.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onSelect(theme.id)}
                    className={`relative p-4 rounded-2xl border transition-all overflow-hidden ${currentTheme === theme.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10 hover:border-white/30'}`}
                >
                    {/* Theme Preview Background */}
                    <div className={`absolute inset-0 ${theme.backgroundClass} opacity-80`} />
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full ${theme.accentClass} shadow-lg flex items-center justify-center`}>
                            {currentTheme === theme.id && <Check size={20} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-white shadow-black drop-shadow-md">{theme.name}</span>
                    </div>
                </button>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};