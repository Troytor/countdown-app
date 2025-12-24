import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { CountdownEvent, TimeLeft } from '../types';
import { calculateTimeLeft, getPrettyDate, getPrettyTime } from '../utils';

interface DetailViewProps {
  event: CountdownEvent;
  onBack: () => void;
  onDelete: (id: string) => void;
}

// Rolling Digit Component for smooth animations
const AnimatedDigit = ({ value }: { value: number }) => {
    return (
        <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-block align-top mx-[1px]">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

// Wrapper to handle 2-digit numbers
const AnimatedNumberBlock = ({ value }: { value: number }) => {
    const padded = String(value).padStart(2, '0');
    const d1 = parseInt(padded[0]);
    const d2 = parseInt(padded[1]);

    return (
        <div className="flex justify-center tabular-nums leading-none">
            <AnimatedDigit value={d1} />
            <AnimatedDigit value={d2} />
        </div>
    );
};

const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-2"
    >
      <div className="text-5xl sm:text-7xl font-thin tracking-tighter text-white drop-shadow-lg">
          <AnimatedNumberBlock value={value} />
      </div>
      <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50 mt-4">{label}</span>
    </motion.div>
);

export const DetailView: React.FC<DetailViewProps> = ({ event, onBack, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(event.date));

  useEffect(() => {
    // Update immediately to prevent stale data flash
    setTimeLeft(calculateTimeLeft(event.date));
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`https://picsum.photos/seed/${event.imageSeed}/1080/1920`} 
          alt="bg" 
          className="w-full h-full object-cover opacity-40 blur-sm scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${event.color} mix-blend-multiply opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center mt-safe-top">
        <button 
          onClick={onBack}
          className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex gap-3">
           <button 
            onClick={() => onDelete(event.id)}
            className="p-3 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-full text-red-200 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6">
        
        <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-4xl sm:text-6xl font-bold text-center text-white mb-4 leading-tight drop-shadow-2xl tracking-tight"
        >
          {event.title}
        </motion.h1>
        
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-white/80 mb-16 backdrop-blur-md bg-white/5 border border-white/10 px-5 py-2.5 rounded-full shadow-lg"
        >
            <Calendar size={14} className="opacity-70" />
            <span className="text-sm font-semibold tracking-wide">{getPrettyDate(event.date)} • {getPrettyTime(event.date)}</span>
        </motion.div>

        {timeLeft.isPast ? (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center"
             >
                <div className="text-7xl mb-6">🎉</div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Event Completed!</h2>
             </motion.div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-12 sm:gap-12 w-full max-w-5xl px-4">
              <TimeUnit value={timeLeft.days} label="Days" delay={0.1} />
              <TimeUnit value={timeLeft.hours} label="Hours" delay={0.2} />
              <TimeUnit value={timeLeft.minutes} label="Minutes" delay={0.3} />
              <TimeUnit value={timeLeft.seconds} label="Seconds" delay={0.4} />
            </div>
        )}
      </main>

      {/* Footer / Progress */}
      <div className="relative z-10 p-8 w-full max-w-md mx-auto mb-safe-bottom">
         {!timeLeft.isPast && (
             <div className="flex flex-col gap-3">
                 <div className="flex justify-between text-xs font-bold text-white/50 uppercase tracking-widest">
                     <span>Progress</span>
                     <span>{Math.max(0, Math.min(100, (1 - timeLeft.totalSeconds / (30 * 24 * 60 * 60)) * 100)).toFixed(0)}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, (1 - timeLeft.totalSeconds / (30 * 24 * 60 * 60)) * 100))}%` }} 
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)]" 
                     />
                 </div>
             </div>
         )}
      </div>
    </motion.div>
  );
};
