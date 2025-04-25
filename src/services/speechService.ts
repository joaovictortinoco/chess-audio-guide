
export class SpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private volume: number = 1;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, onEnd?: () => void): void {
    this.stop();
    
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.volume = this.volume;
    
    // Find a good voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Male') || voice.name.toLowerCase().includes('daniel'))
    );
    
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }
    
    if (onEnd) {
      this.utterance.onend = onEnd;
    }
    
    this.synth.speak(this.utterance);
  }

  stop(): void {
    this.synth.cancel();
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.utterance) {
      this.utterance.volume = volume;
    }
  }

  isPaused(): boolean {
    return this.synth.paused;
  }

  pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }
}

export const speechService = new SpeechService();
