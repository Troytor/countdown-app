import React, { useEffect, useState } from 'react';
import { CountdownEvent, TimeLeft } from '../types';
import { calculateTimeLeft, getPrettyDate } from '../utils';
import { motion } from 'framer-motion';

interface WidgetCardProps {
  event: CountdownEvent;
  onSelect: (event: CountdownEvent) => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ event, onSelect }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(event.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  return (
    <motion.div 
      onClick={() => onSelect(event)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex-shrink-0 w-72 h-40 mr-4 rounded-[2rem] overflow-hidden shadow-xl cursor-pointer snap-start"
    >
        {/* Dynamic Widget Background */}
        <div className="absolute inset-0">
             <img 
                src={`https://picsum.photos/seed/${event.imageSeed}/600/300`} 
                alt="bg" 
                className="w-full h-full object-cover opacity-80"
             />
             <div className={`absolute inset-0 bg-gradient-to-br ${event.color} mix-blend-multiply opacity-60`} />
             <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Glass Content Layer */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between backdrop-blur-[2px]">
             <div className="flex justify-between items-start">
                 <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">{getPrettyDate(event.date).split(',')[0]}</span>
                 </div>
                 {timeLeft.days <= 3 && !timeLeft.isPast && (
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                 )}
             </div>

             <div>
                 <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight line-clamp-1">{event.title}</h3>
                 <div className="flex items-baseline mt-1 gap-1.5">
                    {timeLeft.isPast ? (
                        <span className="text-sm font-semibold text-white/80">Finished</span>
                    ) : (
                        <>
                             <span className="text-3xl font-light tracking-tighter tabular-nums text-white drop-shadow-sm">
                                {timeLeft.days > 0 ? timeLeft.days : `${String(timeLeft.hours).padStart(2,'0')}:${String(timeLeft.minutes).padStart(2,'0')}`}
                             </span>
                             <span className="text-[10px] font-semibold uppercase text-white/70 tracking-wide">
                                {timeLeft.days > 0 ? 'Days Left' : 'Time Left'}
                             </span>
                        </>
                    )}
                 </div>
             </div>
        </div>
    </motion.div>
  );
};
