import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Settings, Sparkles } from 'lucide-react';
import { CountdownEvent, ViewState, ThemeId } from './types';
import { EventItem } from './components/EventItem';
import { DetailView } from './components/DetailView';
import { AddEventForm } from './components/AddEventForm';
import { ThemeSelector } from './components/ThemeSelector';
import { THEMES, calculateTimeLeft, playSound } from './utils';

const STORAGE_KEY = 'chronos_events_v2';
const THEME_KEY = 'chronos_theme_v1';

const INITIAL_DATA: CountdownEvent[] = [
  {
    id: '1',
    title: 'New Year 2026',
    date: '2026-01-01T00:00:00.000Z',
    color: 'from-blue-500 to-purple-600',
    imageSeed: 101,
    isPinned: false,
    notificationSettings: {
        soundId: 'cosmic',
        enabled: true,
        notifyOnCompletion: true,
        notify1HourBefore: true,
        notify1DayBefore: false,
        hasNotified1Hour: false,
        hasNotified1Day: false,
        hasNotifiedCompletion: false
    }
  },
  {
    id: '2',
    title: 'Kyoto Trip',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), 
    color: 'from-emerald-400 to-cyan-500',
    imageSeed: 204,
    isPinned: false,
    notificationSettings: {
        soundId: 'glass',
        enabled: false,
        notifyOnCompletion: true,
        notify1HourBefore: false,
        notify1DayBefore: false,
        hasNotified1Hour: false,
        hasNotified1Day: false,
        hasNotifiedCompletion: false
    }
  }
];

export default function App() {
  const [events, setEvents] = useState<CountdownEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
      return (localStorage.getItem(THEME_KEY) as ThemeId) || 'obsidian';
  });

  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, currentThemeId);
  }, [currentThemeId]);

  // --- NOTIFICATION ENGINE ---
  useEffect(() => {
      const interval = setInterval(() => {
          let eventsUpdated = false;
          const updatedEvents = events.map(event => {
             if (!event.notificationSettings.enabled) return event;

             const timeLeft = calculateTimeLeft(event.date);
             const settings = event.notificationSettings;
             let changed = false;
             
             // Check Completion
             if (timeLeft.isPast && settings.notifyOnCompletion && !settings.hasNotifiedCompletion) {
                 playSound(settings.soundId);
                 settings.hasNotifiedCompletion = true;
                 changed = true;
             }

             // Check 1 Hour (3600 seconds)
             if (!timeLeft.isPast && timeLeft.totalSeconds <= 3600 && settings.notify1HourBefore && !settings.hasNotified1Hour) {
                 playSound(settings.soundId);
                 settings.hasNotified1Hour = true;
                 changed = true;
             }

             // Check 1 Day (86400 seconds)
             if (!timeLeft.isPast && timeLeft.totalSeconds <= 86400 && settings.notify1DayBefore && !settings.hasNotified1Day) {
                 playSound(settings.soundId);
                 settings.hasNotified1Day = true;
                 changed = true;
             }

             if (changed) {
                 eventsUpdated = true;
                 return { ...event, notificationSettings: settings };
             }
             return event;
          });

          if (eventsUpdated) {
              setEvents(updatedEvents);
          }
      }, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
  }, [events]);


  const handleAddEvent = (newEvent: CountdownEvent) => {
    const updatedEvents = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setEvents(updatedEvents);
    setViewState('list');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setViewState('list');
    setSelectedEventId(null);
  };

  const handleEventSelect = (event: CountdownEvent) => {
    setSelectedEventId(event.id);
    setViewState('detail');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className={`min-h-screen text-white selection:bg-blue-500/30 overflow-hidden font-sans transition-colors duration-1000 ${currentTheme.backgroundClass}`}>
      
      <AnimatePresence mode="wait">
        
        {/* VIEW: LIST (HOME) */}
        {viewState === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="relative z-10 container max-w-lg mx-auto min-h-screen flex flex-col p-6"
          >
            {/* Header */}
            <header className="flex justify-between items-center mb-6 mt-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm">Chronos</h1>
                <p className="text-sm text-white/40 font-medium">Upcoming Moments</p>
              </div>
              <button 
                onClick={() => setViewState('settings')}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
              >
                <Settings size={20} className="text-white/60" />
              </button>
            </header>

            <div className="flex-1 pb-28 overflow-y-auto no-scrollbar mask-image-gradient">
                
                {/* LIST SECTION */}
                <div className="space-y-4">
                     {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-white/30 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
                           <Sparkles size={48} className="mb-4 opacity-50" />
                           <p className="font-medium">No countdowns yet</p>
                           <p className="text-xs opacity-60 mt-1">Tap + to add one</p>
                        </div>
                     ) : (
                        <AnimatePresence mode='popLayout'>
                            {events.map(event => (
                              <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                              >
                                <EventItem 
                                    event={event} 
                                    onSelect={handleEventSelect} 
                                />
                              </motion.div>
                            ))}
                        </AnimatePresence>
                     )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewState('add')}
                className={`pointer-events-auto text-white p-5 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow ${currentTheme.accentClass} flex items-center justify-center`}
              >
                <Plus size={28} strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* VIEW: DETAIL */}
        {viewState === 'detail' && selectedEvent && (
          <DetailView 
            key="detail"
            event={selectedEvent} 
            onBack={() => setViewState('list')}
            onDelete={handleDeleteEvent}
          />
        )}
      </AnimatePresence>

      {/* VIEW: ADD (MODAL) */}
      <AnimatePresence>
        {viewState === 'add' && (
          <AddEventForm 
            onClose={() => setViewState('list')} 
            onAdd={handleAddEvent} 
          />
        )}
      </AnimatePresence>

      {/* VIEW: THEME SETTINGS (MODAL) */}
      <AnimatePresence>
          {viewState === 'settings' && (
              <ThemeSelector
                  currentTheme={currentThemeId}
                  onSelect={(id) => setCurrentThemeId(id)}
                  onClose={() => setViewState('list')}
              />
          )}
      </AnimatePresence>
    </div>
  );
}
