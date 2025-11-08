import React from 'react';

export enum CallType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
  MISSED = 'missed',
}

export interface Call {
  id: string;
  type: CallType;
  number: string;
  name?: string;
  timestamp: string; // ISO 8601 string
  duration?: number; // In seconds
}

export interface Voicemail {
  id: string;
  senderNumber: string;
  senderName?: string;
  timestamp: string; // ISO 8601 string
  duration: number; // In seconds
  audioBase64: string;
  transcription: string;
  isRead: boolean;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  labels: string[];
}

export interface ActiveCall {
  id: string;
  number: string;
  name?: string;
  startTime: number; // Unix timestamp in milliseconds
}

export interface VoipContextType {
  dialedNumber: string;
  setDialedNumber: React.Dispatch<React.SetStateAction<string>>;
  callHistory: Call[];
  addCall: (call: Omit<Call, 'id' | 'timestamp'>) => void;
  voicemails: Voicemail[];
  addVoicemail: (voicemail: Omit<Voicemail, 'id' | 'timestamp' | 'audioBase64'>, audioBase64: string) => void;
  markVoicemailAsRead: (id: string) => void;
  deleteVoicemail: (id: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  activeCall: ActiveCall | null;
  startCall: (number: string) => void;
  endCall: () => void;
  incomingCall: Call | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<Call | null>>;
  answerCall: (call: Call) => void;
  declineCall: (call: Call) => void;
}

export enum AISpeechPurpose {
  GUIDE = 'guide',
  NOTIFICATION = 'notification',
  SIMULATION = 'simulation',
}

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}
