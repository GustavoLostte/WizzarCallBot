import {
  Call,
  CallType,
  Voicemail,
  Contact,
  AISpeechPurpose,
} from '../types';
import {
  INITIAL_CALL_HISTORY,
  INITIAL_VOICEMAILS,
  INITIAL_CONTACTS,
  generateUniqueId,
  AI_SIMULATION_NUMBER,
  INCOMING_CALL_SIMULATION_NUMBER,
} from '../constants';
import { speak } from './speechService';

class VoipService {
  private callHistory: Call[];
  private voicemails: Voicemail[];
  private contacts: Contact[];
  private incomingCallTimer: number | null = null;
  private readonly INCOMING_CALL_DELAY_MS = 3000; // 3 seconds delay for simulated incoming call

  constructor() {
    this.callHistory = [...INITIAL_CALL_HISTORY];
    this.voicemails = [...INITIAL_VOICEMAILS];
    this.contacts = [...INITIAL_CONTACTS];
  }

  // --- Call History ---
  getCallHistory(): Call[] {
    return this.callHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addCall(call: Omit<Call, 'id' | 'timestamp'>): Call {
    const newCall: Call = {
      ...call,
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
    };
    this.callHistory.push(newCall);
    return newCall;
  }

  // --- Voicemail ---
  getVoicemails(): Voicemail[] {
    return this.voicemails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addVoicemail(voicemail: Omit<Voicemail, 'id' | 'timestamp' | 'audioBase64'>, audioBase64: string): Voicemail {
    const newVoicemail: Voicemail = {
      ...voicemail,
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
      audioBase64: audioBase64,
    };
    this.voicemails.push(newVoicemail);
    return newVoicemail;
  }

  markVoicemailAsRead(id: string): void {
    const voicemail = this.voicemails.find((vm) => vm.id === id);
    if (voicemail) {
      voicemail.isRead = true;
    }
  }

  deleteVoicemail(id: string): void {
    this.voicemails = this.voicemails.filter((vm) => vm.id !== id);
  }

  // --- Contacts ---
  getContacts(): Contact[] {
    return this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  getContactByNumber(number: string): Contact | undefined {
    return this.contacts.find((contact) => contact.number === number);
  }

  addContact(contact: Omit<Contact, 'id'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: generateUniqueId(),
    };
    this.contacts.push(newContact);
    return newContact;
  }

  updateContact(id: string, updates: Partial<Contact>): Contact | undefined {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    if (index > -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates };
      return this.contacts[index];
    }
    return undefined;
  }

  deleteContact(id: string): void {
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
  }

  // --- Call Simulation ---
  simulateOutgoingCall(number: string, onSpeech: (text: string, purpose: AISpeechPurpose) => void): Call {
    const contact = this.getContactByNumber(number);
    const name = contact?.name;

    const speechText = name ? `Marcando a ${name}.` : `Marcando número ${number}.`;
    onSpeech(speechText, AISpeechPurpose.NOTIFICATION);

    // Simulate AI interaction if it's the AI simulation number
    if (number === AI_SIMULATION_NUMBER) {
      setTimeout(() => {
        onSpeech("Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", AISpeechPurpose.SIMULATION);
      }, 2000);
    }

    const call = this.addCall({
      type: CallType.OUTGOING,
      number,
      name,
      duration: Math.floor(Math.random() * 300) + 30, // Simulate call duration between 30-330 seconds
    });
    return call;
  }

  simulateIncomingCall(
    number: string,
    onSpeech: (text: string, purpose: AISpeechPurpose) => void,
    onIncoming: (call: Call) => void
  ): void {
    // Clear any existing incoming call timers to prevent multiple simultaneous incoming calls
    if (this.incomingCallTimer) {
      clearTimeout(this.incomingCallTimer);
    }

    this.incomingCallTimer = window.setTimeout(() => {
      const contact = this.getContactByNumber(number);
      const name = contact?.name || number;
      const speechText = `Tienes una llamada entrante de ${name}.`;
      onSpeech(speechText, AISpeechPurpose.NOTIFICATION);

      const incomingCall: Call = {
        id: generateUniqueId(),
        type: CallType.INCOMING,
        number: number,
        name: contact?.name,
        timestamp: new Date().toISOString(),
      };
      onIncoming(incomingCall);
      this.incomingCallTimer = null; // Reset timer after triggering
    }, this.INCOMING_CALL_DELAY_MS);
  }

  clearIncomingCallTimer(): void {
    if (this.incomingCallTimer) {
      clearTimeout(this.incomingCallTimer);
      this.incomingCallTimer = null;
    }
  }

  simulateVoicemail(senderNumber: string, senderName?: string): Voicemail {
    const messages = [
      'Hola, soy [name]. Solo quería saber si recibiste mi correo. Llámame de vuelta cuando puedas.',
      'Este es un mensaje automático. Por favor, devuélvanos la llamada para actualizar su cuenta.',
      'He intentado contactarte varias veces. Por favor, ponte en contacto conmigo lo antes posible.',
      'Solo para decir hola y espero que tengas un buen día. Llámame cuando tengas un minuto.',
    ];
    const transcription = messages[Math.floor(Math.random() * messages.length)].replace('[name]', senderName || senderNumber);
    const duration = Math.floor(Math.random() * 60) + 15; // 15-75 seconds

    // In a real app, `audioBase64` would come from an audio recording.
    // Here we'll generate a placeholder or use a very small, silent audio base64 if needed for a minimal UI.
    // For now, it's just an empty string for simulation.
    const newVoicemail = this.addVoicemail(
      {
        senderNumber,
        senderName,
        duration,
        transcription,
        isRead: false,
      },
      ''
    );
    return newVoicemail;
  }
}

export const voipService = new VoipService();
