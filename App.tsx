import React, { useState, useEffect, useRef } from 'react';
import { VoipProvider, useVoip } from './context/VoipContext';
import DialPad from './components/DialPad';
import CallHistory from './components/CallHistory';
import VoicemailList from './components/VoicemailList';
import ContactList from './components/ContactList';
import IncomingCallNotification from './components/IncomingCallNotification';
import TabbedInterface from './components/TabbedInterface';
import Button from './components/Button';
import NavBar from './components/NavBar'; // Importación existente
import Footer from './components/Footer'; // 🌟 Nueva importación 🌟
import RecordingsList from './components/RecordingsList'; 
import TranscriptionsList from './components/TranscriptionsList'; 
import { stopSpeech } from './services/speechService';

// ActiveCallDisplay component definition outside App.tsx to avoid re-renders
const ActiveCallDisplay: React.FC = () => {
  const { activeCall, endCall } = useVoip();
  const [callDuration, setCallDuration] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeCall) {
      setCallDuration(Math.floor((Date.now() - activeCall.startTime) / 1000));
      intervalRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeCall]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!activeCall) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-700 text-white p-3 md:p-4 shadow-lg z-40 flex items-center justify-between text-sm md:text-base">
      <div className="flex items-center">
        <span className="text-xl md:text-2xl mr-2">📞</span>
        <div>
          <p className="font-bold">Llamando a {activeCall.name || activeCall.number}</p>
          <p className="text-blue-200">{formatDuration(callDuration)}</p>
        </div>
      </div>
      <Button onClick={endCall} variant="danger" size="md" className="py-2 px-4 rounded-full">
        Finalizar
      </Button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const tabContents = [
    { label: 'Historial', content: <CallHistory /> },
    { label: 'Buzón de Voz', content: <VoicemailList /> },
    { label: 'Contactos', content: <ContactList /> },
    { label: 'Grabaciones', content: <RecordingsList /> }, 
    { label: 'Transcripciones', content: <TranscriptionsList /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100"> 
      
      {/* 1. NavBar */}
      <NavBar title="WizzarCallBot Console" /> 

      {/* 2. Contenido Principal - Ocupa el espacio restante */}
      <div className="flex flex-col md:flex-row flex-grow p-2 md:p-4 overflow-hidden">
        {/* Left Column - DialPad */}
        <div className="md:w-1/3 lg:w-1/4 p-2 md:p-4 flex flex-col items-center">
          <DialPad />
        </div>

        {/* Right Column - Main Content Area */}
        <div className="md:w-2/3 lg:w-3/4 p-2 md:p-4 flex flex-col overflow-hidden">
          <div className="flex-grow h-full">
            <TabbedInterface tabs={tabContents} />
          </div>
        </div>
      </div>
      
      {/* 3. Footer */}
      <Footer /> 

      {/* Notificaciones y Llamada Activa (están en fixed, pero se mantienen aquí por claridad) */}
      <IncomingCallNotification />
      <ActiveCallDisplay />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Ensure speech stops on component unmount or app close
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <VoipProvider>
      <AppContent />
    </VoipProvider>
  );
};

export default App;