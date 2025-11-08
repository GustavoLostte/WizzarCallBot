import { CallType, Contact, Voicemail, Call } from './types';

export const INITIAL_CALL_HISTORY: Call[] = [
  { id: 'ch1', type: CallType.OUTGOING, number: '555-123-4567', name: 'Alice', timestamp: '2025-07-30T10:00:00Z', duration: 120 },
  { id: 'ch2', type: CallType.INCOMING, number: '555-987-6543', name: 'Bob', timestamp: '2025-07-29T15:30:00Z', duration: 65 },
  { id: 'ch3', type: CallType.MISSED, number: '555-111-2222', timestamp: '2025-07-28T09:15:00Z' },
  { id: 'ch4', type: CallType.OUTGOING, number: '555-333-4444', name: 'Charlie', timestamp: '2025-07-27T18:45:00Z', duration: 300 },
  { id: 'ch5', type: CallType.INCOMING, number: '555-555-5555', name: 'Dave', timestamp: '2025-07-26T11:20:00Z', duration: 90 },
];

export const INITIAL_VOICEMAILS: Voicemail[] = [
  {
    id: 'vm1',
    senderNumber: '555-123-4567',
    senderName: 'Alice',
    timestamp: '2025-07-31T08:00:00Z',
    duration: 35,
    audioBase64: '', // Placeholder, actual audio will be simulated or generated
    transcription: 'Hola, soy Alice. Solo quería saber si recibiste mi correo. Llámame de vuelta cuando puedas.',
    isRead: false,
  },
  {
    id: 'vm2',
    senderNumber: '555-999-0000',
    senderName: 'Soporte Técnico',
    timestamp: '2025-07-29T14:10:00Z',
    duration: 60,
    audioBase64: '',
    transcription: 'Este es un mensaje de soporte técnico. Su ticket ha sido actualizado. Visite nuestro portal para más detalles.',
    isRead: true,
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Alice Smith', number: '555-123-4567', labels: ['cliente'] },
  { id: 'c2', name: 'Bob Johnson', number: '555-987-6543', labels: ['proveedor'] },
  { id: 'c3', name: 'Charlie Brown', number: '555-333-4444', labels: ['interno'] },
  { id: 'c4', name: 'Dave Davis', number: '555-555-5555', labels: ['cliente'] },
  { id: 'c5', name: 'Eve Adams', number: '555-777-8888', labels: ['interno'] },
];

export const AI_SIMULATION_NUMBER = '1234'; // A number that triggers AI simulation
export const INCOMING_CALL_SIMULATION_NUMBER = '911'; // A number that triggers a simulated incoming call

// Helper function to simulate unique IDs
export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
