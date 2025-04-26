export class SpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private volume: number = 1;
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    this.synth.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
    console.log('Available voices:', this.voices);

    // Filtra vozes masculinas em português do Brasil
    const maleBrVoices = this.voices.filter(voice =>
      voice.lang.toLowerCase().startsWith('pt-br') &&
      !voice.name.toLowerCase().includes('female')
    );
    console.log('Filtered male BR voices:', maleBrVoices);
  }

  async speak(text: string): Promise<void> {
    if (this.isSpeaking) {
      this.synth.cancel();
    }

    this.isSpeaking = true;

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.pitch = 0.8;
    this.utterance.rate = 1.4;
    this.utterance.volume = this.volume;

    if (this.voices.length > 0) {
      const brMaleVoice = this.voices.find(voice =>
        voice.lang.toLowerCase().startsWith('pt-br') &&
        voice.name.toLowerCase().includes('google')
      );

      if (brMaleVoice) {
        this.utterance.voice = brMaleVoice;
        console.log('Using BR male voice:', brMaleVoice.name);
      } else {
        this.utterance.voice = this.voices[0];
        console.log('Using fallback voice:', this.voices[0].name);
      }
    } else {
      console.warn('No voices available. Speech synthesis may not work.');
    }

    this.utterance.onend = () => {
      console.log('Utterance ended:', text);
      this.isSpeaking = false;
    };

    this.utterance.onerror = (event) => {
      console.error('Error in speech synthesis:', event);
      this.isSpeaking = false;
    };

    console.log('Speaking:', text);
    this.synth.speak(this.utterance);

    await new Promise<void>((resolve) => {
      const checkEnd = () => {
        if (!this.synth.speaking) {
          resolve();
        } else {
          setTimeout(checkEnd, 100);
        }
      };
      checkEnd();
    });
  }

  stop(): void {
    this.synth.cancel();
    this.isSpeaking = false;
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