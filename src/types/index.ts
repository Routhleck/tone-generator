export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export type NoiseType = 'white' | 'pink' | 'brown' | 'blue' | 'violet' | 'grey';

export type SoundMode = 'tone' | 'noise' | 'rhythm';

export interface ToneGeneratorState {
  frequency: number;
  waveform: WaveformType;
  noiseType: NoiseType;
  soundMode: SoundMode;
  isPlaying: boolean;
  volume: number;
}

export interface AudioEngineConfig {
  initialFrequency?: number;
  initialWaveform?: WaveformType;
  initialNoiseType?: NoiseType;
  initialSoundMode?: SoundMode;
  initialVolume?: number;
}

export type RhythmTransitionType = 'linear' | 'exponential' | 'sine';

export interface RhythmSettings {
  enabled: boolean;
  startFrequency: number;
  endFrequency: number;
  duration: number; // in seconds
  transitionType: RhythmTransitionType;
  loop: boolean;
}
