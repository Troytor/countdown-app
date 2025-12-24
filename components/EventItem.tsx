import React, { useEffect, useState, memo } from 'react';
import { CountdownEvent, TimeLeft } from '../types';
import { calculateTimeLeft, getPrettyDate } from '../utils';
import { GlassCard } from './GlassCard';

interface EventItemProps {
  event: CountdownEvent;
  onSelect: (event: CountdownEvent) => void;
}

// 1. Extract Timer Logic to separate component to prevent parent re-renders
const LiveTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        // Initial calculation
        const initial = calculateTimeLeft(targetDate);
        setTimeLeft(initial);
        setIsUrgent(initial.totalSeconds < 86400 && !initial.isPast);

        const timer = setInterval(() => {
            const tl = calculateTimeLeft(targetDate);
            setTimeLeft(tl);
            // Only update urgency if it changes to avoid heavy re-renders
            const urgent = tl.totalSeconds < 86400 && !tl.isPast;
            if (urgent !== isUrgent) setIsUrgent(urgent);
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, isUrgent]); // Depend on urgency to update state correctly

    if (timeLeft.isPast) {
        return <span className="text-lg font-bold text-white/60">Completed</span>;
    }

    if (timeLeft.days > 0) {
        return (
            <div className="flex flex-col items-end">
                <span className="text-4xl font-light tracking-tighter tabular-nums leading-none">
                    {timeLeft.days}
                </span>
                <span className="text-xs font-medium text-white/70 uppercase tracking-widest mt-1">Days Left</span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-end transition-colors duration-500 ${isUrgent ? 'text-red-200' : 'text-white'}`}>
             <div className="flex items-baseline tabular-nums leading-none tracking-tighter">
                <span className="text-3xl font-light w-[2ch] text-right">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-3xl font-light mx-0.5 opacity-50 animate-pulse">:</span>
                <span className="text-3xl font-light w-[2ch] text-right">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-3xl font-light mx-0.5 opacity-50 animate-pulse">:</span>
                <span className="text-3xl font-light w-[2ch] text-right">{String(timeLeft.seconds).padStart(2, '0')}</span>
             </div>
             <span className="text-xs font-medium text-white/70 uppercase tracking-widest mt-1">Time Left</span>
        </div>
    );
};

// 2. Memoize the EventItem to prevent list flicker when other items change
export const EventItem: React.FC<EventItemProps> = memo(({ event, onSelect }) => {
  return (
    <GlassCard 
        onClick={() => onSelect(event)} 
        className="mb-4 group h-32 flex flex-row items-center relative overflow-hidden fix-safari-border-radius" 
        noPadding
    >
      {/* Background Image with Overlay - Static, never re-renders on tick */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src={`https://picsum.photos/seed/${event.imageSeed}/800/400`} 
          alt="bg" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-[2000ms] ease-out group-hover:scale-105 will-change-transform" 
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${event.color} mix-blend-overlay opacity-80`} />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full p-6 flex justify-between items-center">
        <div className="flex flex-col justify-center h-full max-w-[60%]">
          <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md truncate pr-4">{event.title}</h3>
          <p className="text-xs font-medium text-white/80 uppercase tracking-widest mt-1 opacity-80">{getPrettyDate(event.date)}</p>
        </div>

        <div className="flex flex-col items-end min-w-[35%]">
            <LiveTimer targetDate={event.date} />
        </div>
      </div>
    </GlassCard>
  );
}, (prev, next) => {
    // Custom comparison to ensure strict update rules
    return prev.event.id === next.event.id && 
           prev.event.title === next.event.title && 
           prev.event.date === next.event.date &&
           prev.event.color === next.event.color;
});
