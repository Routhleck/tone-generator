import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from './services/AudioEngine';
import { FrequencyControl } from './components/FrequencyControl';
import { WaveformSelector } from './components/WaveformSelector';
import { PlaybackControl } from './components/PlaybackControl';
import { OctaveButtons } from './components/OctaveButtons';
import { SoundModeSelector } from './components/SoundModeSelector';
import { NoiseSelector } from './components/NoiseSelector';
import { RhythmControl } from './components/RhythmControl';
import { VolumeControl } from './components/VolumeControl';
import { FrequencyPresets } from './components/FrequencyPresets';
import type { WaveformType, NoiseType, SoundMode, RhythmSettings } from './types';
import './App.css';

const MIN_FREQUENCY = 20;
const MAX_FREQUENCY = 20000;

function App() {
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [noiseType, setNoiseType] = useState<NoiseType>('white');
  const [soundMode, setSoundMode] = useState<SoundMode>('tone');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [rhythmSettings, setRhythmSettings] = useState<RhythmSettings>({
    enabled: true, // Default enabled for rhythm mode
    startFrequency: 200,
    endFrequency: 800,
    duration: 5,
    transitionType: 'linear',
    loop: false,
  });

  const audioEngineRef = useRef<AudioEngine | null>(null);

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine({
      initialFrequency: frequency,
      initialWaveform: waveform,
      initialNoiseType: noiseType,
      initialSoundMode: soundMode,
      initialVolume: volume,
    });

    return () => {
      audioEngineRef.current?.dispose();
    };
  }, []);

  // Handle frequency change
  const handleFrequencyChange = useCallback((newFrequency: number) => {
    const clampedFrequency = Math.max(
      MIN_FREQUENCY,
      Math.min(MAX_FREQUENCY, newFrequency)
    );
    setFrequency(clampedFrequency);
    audioEngineRef.current?.setFrequency(clampedFrequency);
  }, []);

  // Handle waveform change
  const handleWaveformChange = useCallback((newWaveform: WaveformType) => {
    setWaveform(newWaveform);
    audioEngineRef.current?.setWaveform(newWaveform);
  }, []);

  // Handle noise type change
  const handleNoiseTypeChange = useCallback((newNoiseType: NoiseType) => {
    setNoiseType(newNoiseType);
    audioEngineRef.current?.setNoiseType(newNoiseType);
  }, []);

  // Handle sound mode change
  const handleSoundModeChange = useCallback((newMode: SoundMode) => {
    setSoundMode(newMode);
    audioEngineRef.current?.setSoundMode(newMode);
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioEngineRef.current?.setVolume(newVolume);
  }, []);

  // Handle play/pause toggle
  const handleTogglePlay = useCallback(() => {
    if (audioEngineRef.current) {
      if (isPlaying) {
        audioEngineRef.current.stop();
        setIsPlaying(false);
      } else {
        audioEngineRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Handle octave buttons
  const handleHalveFrequency = useCallback(() => {
    handleFrequencyChange(frequency / 2);
  }, [frequency, handleFrequencyChange]);

  const handleDoubleFrequency = useCallback(() => {
    handleFrequencyChange(frequency * 2);
  }, [frequency, handleFrequencyChange]);

  // Handle rhythm settings change
  const handleRhythmSettingsChange = useCallback((newSettings: RhythmSettings) => {
    setRhythmSettings(newSettings);
    audioEngineRef.current?.setRhythmSettings(newSettings);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      let handled = false;

      // Space bar: play/pause
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
        handled = true;
      }

      // Arrow keys: adjust frequency (only in tone mode)
      if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && soundMode === 'tone') {
        e.preventDefault();
        const direction = e.code === 'ArrowRight' ? 1 : -1;

        let increment: number;
        if (e.ctrlKey || e.metaKey) {
          // Ctrl/Cmd + Arrow: ±0.01 Hz
          increment = 0.01;
        } else if (e.shiftKey) {
          // Shift + Arrow: ±1 Hz
          increment = 1;
        } else {
          // Arrow: ±10 Hz
          increment = 10;
        }

        const newFrequency = frequency + direction * increment;
        handleFrequencyChange(newFrequency);
        handled = true;
      }

      if (handled) {
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frequency, soundMode, handleFrequencyChange, handleTogglePlay]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Tone Generator</h1>
        <p className="app-subtitle">
          Advanced audio synthesis with tones, noise, and rhythm modulation
        </p>
      </header>

      <main className="app-main">
        {/* Sound Mode Selector */}
        <div className="control-section mode-section">
          <SoundModeSelector
            soundMode={soundMode}
            onSoundModeChange={handleSoundModeChange}
          />
        </div>

        {/* Frequency Control - Only show for tone mode */}
        {soundMode === 'tone' && (
          <div className="control-section">
            <FrequencyControl
              frequency={frequency}
              onFrequencyChange={handleFrequencyChange}
              minFrequency={MIN_FREQUENCY}
              maxFrequency={MAX_FREQUENCY}
            />
          </div>
        )}

        {/* Play/Pause Control with Volume */}
        <div className="control-section playback-section">
          <div className="playback-and-volume">
            <PlaybackControl
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
            />
            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>

        {/* Waveform Selector - Only show for tone mode */}
        {soundMode === 'tone' && (
          <>
            <div className="control-section">
              <WaveformSelector
                selectedWaveform={waveform}
                onWaveformChange={handleWaveformChange}
              />
            </div>

            <div className="control-section">
              <OctaveButtons
                onHalveFrequency={handleHalveFrequency}
                onDoubleFrequency={handleDoubleFrequency}
              />
            </div>

            {/* Frequency Presets */}
            <div className="control-section">
              <FrequencyPresets
                currentFrequency={frequency}
                onFrequencySelect={handleFrequencyChange}
              />
            </div>
          </>
        )}

        {/* Noise Selector - Only show for noise mode */}
        {soundMode === 'noise' && (
          <div className="control-section">
            <NoiseSelector
              selectedNoise={noiseType}
              onNoiseChange={handleNoiseTypeChange}
            />
          </div>
        )}

        {/* Rhythm Control - Only show for rhythm mode */}
        {soundMode === 'rhythm' && (
          <div className="control-section">
            <RhythmControl
              rhythmSettings={rhythmSettings}
              onRhythmSettingsChange={handleRhythmSettingsChange}
              currentFrequency={frequency}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="warning-box">
          <h3 className="warning-title">⚠️ Volume Warning</h3>
          <p className="warning-text">
            Please set your volume to a comfortable level before playing.
            Extended exposure to loud sounds can damage your hearing.
          </p>
        </div>
        <div className="features-info">
          <p className="feature-tag">
            <span className="tag-icon">♪</span>
            4 Waveforms
          </p>
          <p className="feature-tag">
            <span className="tag-icon">≈</span>
            6 Noise Types
          </p>
          <p className="feature-tag">
            <span className="tag-icon">⟿</span>
            Rhythm Modulation
          </p>
        </div>
        <p className="app-credits">
          Open Source Tone Generator · Built with React & Web Audio API
        </p>
      </footer>
    </div>
  );
}

export default App;
