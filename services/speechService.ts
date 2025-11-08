import { GoogleGenAI, Modality } from "@google/genai";
import { AISpeechPurpose } from '../types';

declare const process: {
  env: {
    API_KEY: string;
  };
};

// Global audio context for playback
let outputAudioContext: AudioContext | null = null;
let nextStartTime = 0; // Tracks the end of the audio playback queue

// Helper function to decode base64 to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Function to speak text using Gemini TTS
export const speak = async (text: string, purpose: AISpeechPurpose): Promise<void> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not defined. Cannot use Gemini TTS.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Using 'Kore' for a Spanish-speaking voice based on typical mappings
            // Note: Gemini TTS voices are generally locale-agnostic in 'prebuiltVoiceConfig',
            // but the prompt helps guide the pronunciation.
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      // FIX: Use `window.AudioContext` directly, as `webkitAudioContext` is deprecated.
      if (!outputAudioContext) {
        outputAudioContext = new window.AudioContext({ sampleRate: 24000 });
      }

      // Ensure audio context is resumed, especially after user interaction
      if (outputAudioContext.state === 'suspended') {
        await outputAudioContext.resume();
      }

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        outputAudioContext,
        24000,
        1, // Assuming single channel audio from TTS
      );

      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAudioContext.destination);

      // Schedule playback to avoid gaps
      nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
      source.start(nextStartTime);
      nextStartTime += audioBuffer.duration;
    }
  } catch (error) {
    console.error("Error generating or playing speech:", error);
    // Graceful error handling, perhaps speak a fallback message if possible
    // or log to a user-facing error system.
  }
};

// Function to stop all currently playing speech (if any)
export const stopSpeech = () => {
  if (outputAudioContext) {
    // This will stop all connected sources immediately
    outputAudioContext.suspend();
    outputAudioContext.close();
    outputAudioContext = null;
    nextStartTime = 0;
  }
};