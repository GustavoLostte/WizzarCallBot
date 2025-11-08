import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  VoipContextType,
  Call,
  Voicemail,
  Contact,
  ActiveCall,
  AISpeechPurpose,
  // FIX: Import CallType from '../types'
  CallType,
} from '../types';
import { voipService } from '../services/voipService';
import { speak, stopSpeech } from '../services/speechService';
import { generateUniqueId, INCOMING_CALL_SIMULATION_NUMBER } from '../constants';

export const VoipContext = createContext<VoipContextType | undefined>(undefined);

interface VoipProviderProps {
  children: ReactNode;
}

export const VoipProvider: React.FC<VoipProviderProps> = ({ children }) => {
  const [dialedNumber, setDialedNumber] = useState<string>('');
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);

  useEffect(() => {
    // Initialize data from the simulated service
    setCallHistory(voipService.getCallHistory());
    setVoicemails(voipService.getVoicemails());
    setContacts(voipService.getContacts());
  }, []);

  const handleSpeech = useCallback((text: string, purpose: AISpeechPurpose) => {
    speak(text, purpose);
  }, []);

  const addCall = useCallback((call: Omit<Call, 'id' | 'timestamp'>) => {
    const newCall = voipService.addCall(call);
    setCallHistory((prev) => [newCall, ...prev]);
  }, []);

  const addVoicemail = useCallback((voicemail: Omit<Voicemail, 'id' | 'timestamp' | 'audioBase64'>, audioBase64: string) => {
    const newVoicemail = voipService.addVoicemail(voicemail, audioBase64);
    setVoicemails((prev) => [newVoicemail, ...prev]);
  }, []);

  const markVoicemailAsRead = useCallback((id: string) => {
    voipService.markVoicemailAsRead(id);
    setVoicemails((prev) => prev.map((vm) => (vm.id === id ? { ...vm, isRead: true } : vm)));
  }, []);

  const deleteVoicemail = useCallback((id: string) => {
    voipService.deleteVoicemail(id);
    setVoicemails((prev) => prev.filter((vm) => vm.id !== id));
  }, []);

  const addContact = useCallback((contact: Omit<Contact, 'id'>) => {
    const newContact = voipService.addContact(contact);
    setContacts((prev) => [...prev, newContact]);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    const updatedContact = voipService.updateContact(id, updates);
    if (updatedContact) {
      setContacts((prev) => prev.map((c) => (c.id === id ? updatedContact : c)));
    }
  }, []);

  const deleteContact = useCallback((id: string) => {
    voipService.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const startCall = useCallback((number: string) => {
    stopSpeech(); // Stop any ongoing speech before a new call
    const simulatedCall = voipService.simulateOutgoingCall(number, handleSpeech);
    setActiveCall({
      id: generateUniqueId(),
      number: simulatedCall.number,
      name: simulatedCall.name,
      startTime: Date.now(),
    });
    setDialedNumber(''); // Clear the dialed number
    setIncomingCall(null); // Clear incoming call if dialing out
  }, [handleSpeech]);

  const endCall = useCallback(() => {
    if (activeCall) {
      // For simplicity, we don't update call history for active calls here,
      // as `simulateOutgoingCall` already adds a call entry with a simulated duration.
      // In a real app, duration would be calculated here.
    }
    setActiveCall(null);
    stopSpeech(); // Stop any speech related to the call
  }, [activeCall]);

  const answerCall = useCallback((call: Call) => {
    stopSpeech(); // Stop "incoming call" announcement
    setActiveCall({
      id: generateUniqueId(),
      number: call.number,
      name: call.name,
      startTime: Date.now(),
    });
    setIncomingCall(null); // Clear incoming call once answered
    // Add call to history (as an answered incoming call)
    addCall({ ...call, type: CallType.INCOMING, duration: 0 }); // Duration will be updated on endCall
  }, [addCall]);

  const declineCall = useCallback((call: Call) => {
    stopSpeech(); // Stop "incoming call" announcement
    setIncomingCall(null);
    // Add call to history as missed
    addCall({ ...call, type: CallType.MISSED });
  }, [addCall]);

  // Simulate incoming call based on dialed number
  useEffect(() => {
    if (dialedNumber === INCOMING_CALL_SIMULATION_NUMBER) {
      voipService.simulateIncomingCall(
        '555-000-0000', // Simulated incoming number
        handleSpeech,
        (call) => {
          setIncomingCall(call);
        }
      );
      setDialedNumber(''); // Clear the simulation number
    }
    // Cleanup function to clear any pending incoming call timers
    return () => {
      voipService.clearIncomingCallTimer();
    };
  }, [dialedNumber, handleSpeech]);

  const contextValue = {
    dialedNumber,
    setDialedNumber,
    callHistory,
    addCall,
    voicemails,
    addVoicemail,
    markVoicemailAsRead,
    deleteVoicemail,
    contacts,
    addContact,
    updateContact,
    deleteContact,
    activeCall,
    startCall,
    endCall,
    incomingCall,
    setIncomingCall,
    answerCall,
    declineCall,
  };

  return <VoipContext.Provider value={contextValue}>{children}</VoipContext.Provider>;
};

// Custom hook to use the VoIP context
export const useVoip = () => {
  const context = React.useContext(VoipContext);
  if (context === undefined) {
    throw new Error('useVoip must be used within a VoipProvider');
  }
  return context;
};