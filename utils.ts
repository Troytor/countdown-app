import { TimeLeft, Theme, SoundId } from './types';
import { differenceInSeconds, intervalToDuration, isPast, format, differenceInDays } from 'date-fns';

export const calculateTimeLeft = (targetDate: string): TimeLeft => {
  const now = new Date();
  const target = new Date(targetDate);
  const totalSeconds = differenceInSeconds(target, now);
  
  if (totalSeconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: true };
  }

  const duration = intervalToDuration({ start: now, end: target });

  return {
    days: differenceInDays(target, now), // Total days
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    totalSeconds,
    isPast: false,
  };
};

export const getPrettyDate = (dateStr: string) => {
  return format(new Date(dateStr), "EEEE, MMM do, yyyy");
};

export const getPrettyTime = (dateStr: string) => {
  return format(new Date(dateStr), "h:mm a");
};

export const getRandomColor = () => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-emerald-400 to-cyan-500',
    'from-orange-400 to-pink-600',
    'from-indigo-400 to-blue-600',
    'from-pink-500 to-rose-500',
    'from-amber-300 to-orange-500',
    'from-violet-500 to-fuchsia-500',
    'from-cyan-400 to-blue-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// --- THEMES ---

export const THEMES: Theme[] = [
  { 
    id: 'obsidian', 
    name: 'Obsidian', 
    backgroundClass: 'bg-black',
    accentClass: 'bg-white' 
  },
  { 
    id: 'nebula', 
    name: 'Nebula', 
    backgroundClass: 'bg-[#1a0b2e] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#1a0b2e] to-[#1a0b2e]',
    accentClass: 'bg-purple-500' 
  },
  { 
    id: 'nova', 
    name: 'Nova', 
    backgroundClass: 'bg-[#0f172a] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f172a] to-[#0f172a]',
    accentClass: 'bg-blue-500' 
  },
  { 
    id: 'aurora', 
    name: 'Aurora', 
    backgroundClass: 'bg-[#0c1a15] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#0c1a15] to-[#0c1a15]',
    accentClass: 'bg-emerald-500' 
  },
  { 
    id: 'cyber', 
    name: 'Cyber', 
    backgroundClass: 'bg-[#110008] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/30 via-[#110008] to-[#110008]',
    accentClass: 'bg-pink-500' 
  }
];

// --- AUDIO SYNTHESIZER ---

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, gain: number) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playSound = (soundId: SoundId) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  switch (soundId) {
    case 'glass':
      createOscillator(ctx, 'sine', 880, now, 1.5, 0.3);
      createOscillator(ctx, 'triangle', 1760, now + 0.1, 1, 0.1);
      break;
    case 'cosmic':
      createOscillator(ctx, 'sine', 220, now, 2, 0.5);
      createOscillator(ctx, 'sine', 440, now + 0.1, 1.5, 0.3);
      break;
    case 'echo':
      createOscillator(ctx, 'triangle', 330, now, 0.5, 0.2);
      createOscillator(ctx, 'triangle', 330, now + 0.3, 0.5, 0.1);
      createOscillator(ctx, 'triangle', 330, now + 0.6, 0.5, 0.05);
      break;
    case 'orb':
      createOscillator(ctx, 'sine', 110, now, 3, 0.6);
      createOscillator(ctx, 'sine', 112, now, 3, 0.6); // Beat freq
      break;
    case 'warp':
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'pulse':
       createOscillator(ctx, 'square', 440, now, 0.1, 0.1);
       createOscillator(ctx, 'square', 440, now + 0.15, 0.1, 0.1);
      break;
    case 'shimmer':
      createOscillator(ctx, 'sine', 523.25, now, 1, 0.2);
      createOscillator(ctx, 'sine', 659.25, now + 0.05, 1, 0.2);
      createOscillator(ctx, 'sine', 783.99, now + 0.1, 1, 0.2);
      createOscillator(ctx, 'sine', 1046.50, now + 0.15, 1, 0.2);
      break;
    case 'void':
      createOscillator(ctx, 'sawtooth', 55, now, 2, 0.3);
      break;
    case 'drift':
      createOscillator(ctx, 'sine', 300, now, 4, 0.2);
      createOscillator(ctx, 'triangle', 600, now, 4, 0.05);
      break;
    case 'quantum':
      createOscillator(ctx, 'square', 880, now, 0.05, 0.1);
      createOscillator(ctx, 'sine', 110, now + 0.05, 1, 0.5);
      break;
    default:
      createOscillator(ctx, 'sine', 440, now, 1, 0.5);
  }
};
