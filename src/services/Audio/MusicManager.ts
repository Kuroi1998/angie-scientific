export class MusicManager {
  private static instance: MusicManager;
  private audioCtx: AudioContext | null = null;
  private masterVolume: number = 0.15;
  private isEnabled: boolean = true;
  private isPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  
  private constructor() {}

  public static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager();
    }
    return MusicManager.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled && this.isPlaying) {
      this.stopBackgroundMusic();
    } else if (enabled && !this.isPlaying) {
      this.playBackgroundMusic();
    }
  }

  public playBackgroundMusic(): void {
    if (!this.isEnabled || this.isPlaying) return;
    
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.audioCtx = new AudioCtx();
        } catch {}
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.audioCtx) return;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioCtx.currentTime + 2); // Fade in
    this.gainNode.connect(this.audioCtx.destination);

    // Create ambient drone (chord: F2, C3, G3, A3)
    const frequencies = [87.31, 130.81, 196.00, 220.00];
    this.oscillators = frequencies.map(freq => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);
      
      // Add a slow LFO for movement
      const lfo = this.audioCtx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(Math.random() * 0.1 + 0.05, this.audioCtx!.currentTime); // 0.05 - 0.15 Hz
      const lfoGain = this.audioCtx!.createGain();
      lfoGain.gain.setValueAtTime(5, this.audioCtx!.currentTime); // Detune amount
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start();

      osc.connect(this.gainNode!);
      osc.start();
      return osc;
    });

    this.isPlaying = true;
    console.log(`[MusicManager] Playing ambient drone`);
  }

  public stopBackgroundMusic(): void {
    if (!this.isPlaying || !this.gainNode || !this.audioCtx) return;
    
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 2); // Fade out
    
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.oscillators = [];
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      this.isPlaying = false;
      console.log(`[MusicManager] Stopped ambient drone`);
    }, 2100);
  }
}
