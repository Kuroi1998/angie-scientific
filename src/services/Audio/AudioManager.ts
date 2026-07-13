export class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private masterVolume: number = 0.5;
  private isEnabled: boolean = true;
  
  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init(): void {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.audioCtx = new AudioCtx();
        } catch (e) {
          // Fallback for tests
        }
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, volMultiplier = 1): void {
    if (!this.isEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * volMultiplier, this.audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  public playClick(): void {
    // Short high beep
    this.playTone(800, 'sine', 0.1, 0.3);
  }

  public playSuccess(): void {
    // Arpeggio
    if (!this.isEnabled) return;
    this.playTone(440, 'sine', 0.3, 0.5); // A4
    setTimeout(() => this.playTone(554.37, 'sine', 0.3, 0.5), 100); // C#5
    setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.5), 200); // E5
    setTimeout(() => this.playTone(880, 'sine', 0.6, 0.5), 300); // A5
  }

  public playError(): void {
    // Low buzz
    if (!this.isEnabled) return;
    this.playTone(150, 'sawtooth', 0.3, 0.4);
    setTimeout(() => this.playTone(130, 'sawtooth', 0.4, 0.4), 150);
  }

  public playNotification(): void {
    // Soft double chime
    if (!this.isEnabled) return;
    this.playTone(600, 'sine', 0.4, 0.3);
    setTimeout(() => this.playTone(800, 'sine', 0.6, 0.3), 150);
  }
}
