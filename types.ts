export type ThemeId = 'obsidian' | 'nebula' | 'nova' | 'aurora' | 'cyber';

export interface Theme {
  id: ThemeId;
  name: string;
  backgroundClass: string;
  accentClass: string;
}

export type SoundId = 'glass' | 'cosmic' | 'echo' | 'orb' | 'warp' | 'pulse' | 'shimmer' | 'void' | 'drift' | 'quantum';

export interface NotificationSettings {
  soundId: SoundId;
  enabled: boolean;
  notifyOnCompletion: boolean;
  notify1HourBefore: boolean;
  notify1DayBefore: boolean;
  // State tracking to prevent double firing
  hasNotified1Hour: boolean;
  hasNotified1Day: boolean;
  hasNotifiedCompletion: boolean;
}

export interface CountdownEvent {
  id: string;
  title: string;
  date: string; // ISO string
  color: string;
  imageSeed: number;
  isPinned: boolean;
  notificationSettings: NotificationSettings;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

export type ViewState = 'list' | 'detail' | 'add' | 'settings';
