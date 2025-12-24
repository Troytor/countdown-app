import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Clock, Type, Bell, Play } from 'lucide-react';
import { CountdownEvent, SoundId, NotificationSettings } from '../types';
import { getRandomColor, playSound } from '../utils';

// Helper for ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const SOUND_OPTIONS: {id: SoundId, label: string}[] = [
    { id: 'glass', label: 'Glass' },
    { id: 'cosmic', label: 'Cosmic' },
    { id: 'echo', label: 'Echo' },
    { id: 'orb', label: 'Orb' },
    { id: 'warp', label: 'Warp' },
    { id: 'pulse', label: 'Pulse' },
    { id: 'shimmer', label: 'Shimmer' },
    { id: 'void', label: 'Void' },
    { id: 'drift', label: 'Drift' },
    { id: 'quantum', label: 'Quantum' },
];

interface AddEventFormProps {
  onClose: () => void;
  onAdd: (event: CountdownEvent) => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');
  
  // New Features (Pinning removed)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
      soundId: 'glass',
      enabled: false,
      notifyOnCompletion: true,
      notify1HourBefore: false,
      notify1DayBefore: false,
      hasNotified1Hour: false,
      hasNotified1Day: false,
      hasNotifiedCompletion: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const fullDateStr = `${date}T${time}`;
    
    const newEvent: CountdownEvent = {
      id: generateId(),
      title,
      date: new Date(fullDateStr).toISOString(),
      color: getRandomColor(),
      imageSeed: Math.floor(Math.random() * 1000),
      isPinned: false, // Default to false as functionality is removed
      notificationSettings
    };

    onAdd(newEvent);
  };

  const toggleSoundPreview = (soundId: SoundId) => {
      playSound(soundId);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <motion.div 
        className="bg-[#1c1c1e] w-full max-w-lg h-[85vh] sm:h-auto overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] pointer-events-auto shadow-2xl border border-white/10 scroll-smooth no-scrollbar"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">New Countdown</h2>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Event Title</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Type className="text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Anniversary, Trip to Japan..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div className="space-y-2">
                         <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Date</label>
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                            </div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                            />
                         </div>
                    </div>

                    {/* Time Input */}
                    <div className="space-y-2">
                         <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Time</label>
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Clock className="text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                            </div>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                            />
                         </div>
                    </div>
                </div>

                {/* Notification Settings Toggle */}
                <div className="space-y-3">
                     <div 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${showNotifications ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
                        onClick={() => {
                            const newState = !showNotifications;
                            setShowNotifications(newState);
                            setNotificationSettings({...notificationSettings, enabled: newState});
                        }}
                    >
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${showNotifications ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/50'}`}>
                                <Bell size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-white">Sound Notifications</span>
                                <span className="text-xs text-white/50">Alerts & triggers</span>
                            </div>
                        </div>
                         <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showNotifications ? 'bg-amber-500' : 'bg-white/20'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                         </div>
                    </div>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-4 pl-2"
                            >
                                {/* Sound Selection */}
                                <div className="space-y-2 pt-2">
                                     <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Alert Sound</label>
                                     <div className="grid grid-cols-2 gap-2">
                                         {SOUND_OPTIONS.map((opt) => (
                                             <div 
                                                key={opt.id}
                                                onClick={() => setNotificationSettings({...notificationSettings, soundId: opt.id})}
                                                className={`flex items-center justify-between p-2 px-3 rounded-lg border cursor-pointer ${notificationSettings.soundId === opt.id ? 'bg-white/10 border-white/50 text-white' : 'bg-transparent border-white/5 text-white/50 hover:bg-white/5'}`}
                                             >
                                                <span className="text-sm">{opt.label}</span>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); toggleSoundPreview(opt.id); }}
                                                    className="p-1 hover:text-white text-white/50"
                                                >
                                                    <Play size={12} fill="currentColor" />
                                                </button>
                                             </div>
                                         ))}
                                     </div>
                                </div>

                                {/* Triggers */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Triggers</label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: 'notifyOnCompletion', label: 'When finished' },
                                            { key: 'notify1DayBefore', label: '1 Day before' },
                                            { key: 'notify1HourBefore', label: '1 Hour before' }
                                        ].map((trigger) => (
                                            <label key={trigger.key} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notificationSettings[trigger.key as keyof NotificationSettings] ? 'bg-blue-500 border-blue-500' : 'border-white/30 group-hover:border-white/50'}`}>
                                                    {notificationSettings[trigger.key as keyof NotificationSettings] && <Check size={12} />}
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={!!notificationSettings[trigger.key as keyof NotificationSettings]}
                                                    onChange={() => setNotificationSettings({
                                                        ...notificationSettings,
                                                        [trigger.key]: !notificationSettings[trigger.key as keyof NotificationSettings]
                                                    })}
                                                />
                                                <span className="text-sm text-white/80">{trigger.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-4 pb-8">
                    <button 
                        type="submit"
                        disabled={!title || !date}
                        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${(!title || !date) ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'}`}
                    >
                        <Check size={20} strokeWidth={3} />
                        Create Countdown
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </motion.div>
  );
};