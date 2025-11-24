import type { WaveformType, NoiseType, SoundMode, AudioEngineConfig, RhythmSettings } from '../types';
import { NoiseGenerator } from './NoiseGenerator';

/**
 * AudioEngine - Manages Web Audio API for tone and noise generation
 * Supports multiple waveforms, various noise types, and rhythm modulation
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private noiseGenerator: NoiseGenerator | null = null;
  private isInitialized = false;

  private currentFrequency: number;
  private currentWaveform: WaveformType;
  private currentNoiseType: NoiseType;
  private currentSoundMode: SoundMode;
  private currentVolume: number;

  // Rhythm control
  private rhythmSettings: RhythmSettings | null = null;
  private rhythmAnimationId: number | null = null;
  private rhythmStartTime: number = 0;

  constructor(config: AudioEngineConfig = {}) {
    this.currentFrequency = config.initialFrequency || 440;
    this.currentWaveform = config.initialWaveform || 'sine';
    this.currentNoiseType = config.initialNoiseType || 'white';
    this.currentSoundMode = config.initialSoundMode || 'tone';
    this.currentVolume = config.initialVolume || 0.3;
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  private initAudioContext(): void {
    if (this.isInitialized) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.currentVolume;

    this.noiseGenerator = new NoiseGenerator(this.audioContext);

    this.isInitialized = true;
  }

  /**
   * Start playing (tone, noise, or rhythm based on current mode)
   */
  play(): void {
    if (!this.isInitialized) {
      this.initAudioContext();
    }

    if (!this.audioContext || !this.gainNode) {
      return;
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Stop any existing playback
    this.stopSound();

    // Start based on current mode
    if (this.currentSoundMode === 'tone') {
      this.playTone();
    } else if (this.currentSoundMode === 'noise') {
      this.playNoise();
    } else if (this.currentSoundMode === 'rhythm') {
      this.playRhythm();
    }
  }

  /**
   * Play tone with current settings
   */
  private playTone(): void {
    if (!this.audioContext || !this.gainNode || this.oscillator) {
      return;
    }

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = this.currentWaveform;
    this.oscillator.frequency.value = this.currentFrequency;
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
  }

  /**
   * Play noise with current settings
   */
  private playNoise(): void {
    if (!this.audioContext || !this.gainNode || !this.noiseGenerator || this.noiseSource) {
      return;
    }

    const buffer = this.noiseGenerator.createNoiseBuffer(this.currentNoiseType, 2);
    this.noiseSource = this.audioContext.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;
    this.noiseSource.connect(this.gainNode);
    this.noiseSource.start();
  }

  /**
   * Play rhythm (tone with frequency modulation)
   */
  private playRhythm(): void {
    if (!this.audioContext || !this.gainNode || this.oscillator) {
      return;
    }

    // Start with a tone
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = this.currentWaveform;

    // Set initial frequency based on rhythm settings
    const startFreq = this.rhythmSettings?.enabled
      ? this.rhythmSettings.startFrequency
      : this.currentFrequency;

    this.oscillator.frequency.value = startFreq;
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();

    // Start rhythm modulation if enabled
    if (this.rhythmSettings?.enabled) {
      this.startRhythm();
    }
  }

  /**
   * Stop playing
   */
  stop(): void {
    this.stopSound();
    this.stopRhythm();
  }

  /**
   * Stop sound only (keep rhythm running if needed)
   */
  private stopSound(): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }

    if (this.noiseSource) {
      this.noiseSource.stop();
      this.noiseSource.disconnect();
      this.noiseSource = null;
    }
  }

  /**
   * Update the frequency in real-time
   */
  setFrequency(frequency: number): void {
    this.currentFrequency = frequency;

    if (this.oscillator && this.audioContext) {
      this.oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    }
  }

  /**
   * Change the waveform type
   */
  setWaveform(waveform: WaveformType): void {
    this.currentWaveform = waveform;

    if (this.oscillator && this.currentSoundMode === 'tone') {
      const wasPlaying = true;
      this.stopSound();
      if (wasPlaying) {
        this.playTone();
      }
    }
  }

  /**
   * Change the noise type
   */
  setNoiseType(noiseType: NoiseType): void {
    this.currentNoiseType = noiseType;

    if (this.noiseSource && this.currentSoundMode === 'noise') {
      const wasPlaying = true;
      this.stopSound();
      if (wasPlaying) {
        this.playNoise();
      }
    }
  }

  /**
   * Switch between tone and noise mode
   */
  setSoundMode(mode: SoundMode): void {
    const wasPlaying = this.isPlaying();
    this.currentSoundMode = mode;

    if (wasPlaying) {
      this.stopSound();
      if (mode === 'tone') {
        this.playTone();
      } else {
        this.playNoise();
      }
    }
  }

  /**
   * Set the volume (0 to 1)
   */
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));

    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this.currentVolume,
        this.audioContext.currentTime
      );
    }
  }

  /**
   * Configure rhythm settings
   */
  setRhythmSettings(settings: RhythmSettings): void {
    this.rhythmSettings = settings;

    // If playing and rhythm is enabled, restart rhythm
    if (this.isPlaying() && settings.enabled) {
      this.stopRhythm();
      this.startRhythm();
    } else if (!settings.enabled) {
      this.stopRhythm();
    }
  }

  /**
   * Start rhythm modulation (public method for independent control)
   */
  startRhythm(): void {
    if (!this.rhythmSettings?.enabled) {
      return;
    }

    this.rhythmStartTime = Date.now();
    this.updateRhythm();
  }

  /**
   * Update frequency based on rhythm settings
   */
  private updateRhythm(): void {
    if (!this.rhythmSettings?.enabled || !this.isPlaying()) {
      return;
    }

    const elapsed = (Date.now() - this.rhythmStartTime) / 1000;
    const { startFrequency, endFrequency, duration, transitionType, loop } = this.rhythmSettings;

    let progress = Math.min(elapsed / duration, 1);

    // Handle looping
    if (progress >= 1 && loop) {
      this.rhythmStartTime = Date.now();
      progress = 0;
    } else if (progress >= 1) {
      this.stopRhythm();
      return;
    }

    // Calculate frequency based on transition type
    let frequency: number;
    switch (transitionType) {
      case 'linear':
        frequency = startFrequency + (endFrequency - startFrequency) * progress;
        break;
      case 'exponential':
        const ratio = endFrequency / startFrequency;
        frequency = startFrequency * Math.pow(ratio, progress);
        break;
      case 'sine':
        const sineProgress = (Math.sin((progress - 0.5) * Math.PI) + 1) / 2;
        frequency = startFrequency + (endFrequency - startFrequency) * sineProgress;
        break;
      default:
        frequency = startFrequency;
    }

    this.setFrequency(frequency);

    // Continue animation
    this.rhythmAnimationId = requestAnimationFrame(() => this.updateRhythm());
  }

  /**
   * Stop rhythm modulation (public method for independent control)
   */
  stopRhythm(): void {
    if (this.rhythmAnimationId !== null) {
      cancelAnimationFrame(this.rhythmAnimationId);
      this.rhythmAnimationId = null;
    }
  }

  /**
   * Check if rhythm is currently playing
   */
  isRhythmPlaying(): boolean {
    return this.rhythmAnimationId !== null;
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.oscillator !== null || this.noiseSource !== null;
  }

  /**
   * Get current frequency
   */
  getFrequency(): number {
    return this.currentFrequency;
  }

  /**
   * Get current waveform
   */
  getWaveform(): WaveformType {
    return this.currentWaveform;
  }

  /**
   * Get current noise type
   */
  getNoiseType(): NoiseType {
    return this.currentNoiseType;
  }

  /**
   * Get current sound mode
   */
  getSoundMode(): SoundMode {
    return this.currentSoundMode;
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.currentVolume;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.noiseGenerator = null;
    this.isInitialized = false;
  }
}
