import { useState, useEffect } from 'react';
import type { RhythmSettings, RhythmTransitionType } from '../types';
import './RhythmControl.css';

interface RhythmControlProps {
  rhythmSettings: RhythmSettings;
  onRhythmSettingsChange: (settings: RhythmSettings) => void;
  currentFrequency: number;
  isRhythmPlaying?: boolean;
  onRhythmPlayToggle?: () => void;
}

interface RhythmPreset {
  name: string;
  icon: string;
  settings: Partial<RhythmSettings>;
  description: string;
}

const rhythmPresets: RhythmPreset[] = [
  {
    name: 'Slow Sweep',
    icon: '🌊',
    description: 'Gentle frequency sweep',
    settings: {
      startFrequency: 100,
      endFrequency: 1000,
      duration: 10,
      transitionType: 'exponential',
      loop: true,
    },
  },
  {
    name: 'Fast Sweep',
    icon: '⚡',
    description: 'Quick frequency scan',
    settings: {
      startFrequency: 200,
      endFrequency: 800,
      duration: 2,
      transitionType: 'linear',
      loop: false,
    },
  },
  {
    name: 'Binaural Beat',
    icon: '🧘',
    description: 'Subtle frequency variation',
    settings: {
      startFrequency: 200,
      endFrequency: 210,
      duration: 30,
      transitionType: 'sine',
      loop: true,
    },
  },
  {
    name: 'Tinnitus Scan',
    icon: '👂',
    description: 'High frequency exploration',
    settings: {
      startFrequency: 8000,
      endFrequency: 16000,
      duration: 20,
      transitionType: 'linear',
      loop: false,
    },
  },
];

const durationPresets = [1, 5, 10, 30, 60];

export function RhythmControl({
  rhythmSettings,
  onRhythmSettingsChange,
  currentFrequency,
  isRhythmPlaying,
  onRhythmPlayToggle,
}: RhythmControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentRhythmFreq, setCurrentRhythmFreq] = useState(rhythmSettings.startFrequency);

  // Calculate progress when rhythm is playing
  useEffect(() => {
    // If no independent play control, we don't show progress
    if (isRhythmPlaying === undefined) {
      return;
    }

    if (!isRhythmPlaying || !rhythmSettings.enabled) {
      setProgress(0);
      setElapsedTime(0);
      setCurrentRhythmFreq(rhythmSettings.startFrequency);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentProgress = Math.min((elapsed / rhythmSettings.duration) * 100, 100);

      let progress: number;
      if (rhythmSettings.loop) {
        progress = currentProgress % 100;
        setElapsedTime(elapsed % rhythmSettings.duration);
      } else {
        progress = currentProgress;
        setElapsedTime(elapsed);
      }

      setProgress(progress);

      // Calculate current frequency
      const progressRatio = progress / 100;
      const { startFrequency, endFrequency, transitionType } = rhythmSettings;

      let freq: number;
      switch (transitionType) {
        case 'linear':
          freq = startFrequency + (endFrequency - startFrequency) * progressRatio;
          break;
        case 'exponential':
          const ratio = endFrequency / startFrequency;
          freq = startFrequency * Math.pow(ratio, progressRatio);
          break;
        case 'sine':
          const sineProgress = (Math.sin((progressRatio - 0.5) * Math.PI) + 1) / 2;
          freq = startFrequency + (endFrequency - startFrequency) * sineProgress;
          break;
        default:
          freq = startFrequency;
      }

      setCurrentRhythmFreq(freq);
    }, 50);

    return () => clearInterval(interval);
  }, [isRhythmPlaying, rhythmSettings]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePresetSelect = (preset: RhythmPreset) => {
    onRhythmSettingsChange({
      ...rhythmSettings,
      ...preset.settings,
      enabled: true,
    });
  };

  const handleStartFreqChange = (value: string) => {
    const freq = parseFloat(value) || 20;
    onRhythmSettingsChange({
      ...rhythmSettings,
      startFrequency: Math.max(20, Math.min(20000, freq)),
    });
  };

  const handleEndFreqChange = (value: string) => {
    const freq = parseFloat(value) || 20;
    onRhythmSettingsChange({
      ...rhythmSettings,
      endFrequency: Math.max(20, Math.min(20000, freq)),
    });
  };

  const handleDurationChange = (value: string) => {
    const dur = parseFloat(value) || 1;
    onRhythmSettingsChange({
      ...rhythmSettings,
      duration: Math.max(0.1, Math.min(60, dur)),
    });
  };

  const handleDurationPreset = (duration: number) => {
    onRhythmSettingsChange({
      ...rhythmSettings,
      duration,
    });
  };

  const handleTransitionChange = (type: RhythmTransitionType) => {
    onRhythmSettingsChange({
      ...rhythmSettings,
      transitionType: type,
    });
  };

  const handleLoopToggle = () => {
    onRhythmSettingsChange({
      ...rhythmSettings,
      loop: !rhythmSettings.loop,
    });
  };

  const handleUseCurrentFrequency = (target: 'start' | 'end') => {
    if (target === 'start') {
      onRhythmSettingsChange({
        ...rhythmSettings,
        startFrequency: currentFrequency,
      });
    } else {
      onRhythmSettingsChange({
        ...rhythmSettings,
        endFrequency: currentFrequency,
      });
    }
  };

  const remainingTime = rhythmSettings.duration - elapsedTime;

  const getTransitionIcon = (type: RhythmTransitionType) => {
    switch (type) {
      case 'linear': return '─';
      case 'exponential': return '⌒';
      case 'sine': return '∿';
    }
  };

  return (
    <div className={`rhythm-module ${rhythmSettings.enabled ? 'enabled' : ''} ${isRhythmPlaying ? 'playing' : ''}`}>
      <div className="rhythm-module-header">
        <div className="rhythm-header-content">
          <h3 className="rhythm-module-title">
            <span className="rhythm-module-icon">⟿</span>
            Rhythm Modulation Module
          </h3>
          <p className="rhythm-module-subtitle">
            Independent frequency sweep generator
          </p>
        </div>
        <button
          className="rhythm-expand-btn"
          onClick={handleToggleExpand}
          aria-label={isExpanded ? 'Collapse module' : 'Expand module'}
        >
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Rhythm Play Control - Only show if independent play control is provided */}
          {onRhythmPlayToggle && isRhythmPlaying !== undefined && (
            <div className="rhythm-play-control">
              <button
                className={`rhythm-play-button ${isRhythmPlaying ? 'playing' : ''}`}
                onClick={onRhythmPlayToggle}
                disabled={!rhythmSettings.enabled}
                aria-label={isRhythmPlaying ? 'Stop rhythm' : 'Play rhythm'}
              >
                {isRhythmPlaying ? (
                  <>
                    <svg className="play-icon" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                      <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                    </svg>
                    <span>Stop Rhythm</span>
                  </>
                ) : (
                  <>
                    <svg className="play-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                    </svg>
                    <span>Play Rhythm</span>
                  </>
                )}
              </button>

              <label className="rhythm-enable-label">
                <input
                  type="checkbox"
                  className="rhythm-enable-checkbox"
                  checked={rhythmSettings.enabled}
                  onChange={(e) => onRhythmSettingsChange({ ...rhythmSettings, enabled: e.target.checked })}
                />
                <span>Enable Module</span>
              </label>
            </div>
          )}

          {/* Enable checkbox for rhythm mode (without independent play button) */}
          {!onRhythmPlayToggle && (
            <div className="rhythm-enable-control">
              <label className="rhythm-enable-label">
                <input
                  type="checkbox"
                  className="rhythm-enable-checkbox"
                  checked={rhythmSettings.enabled}
                  onChange={(e) => onRhythmSettingsChange({ ...rhythmSettings, enabled: e.target.checked })}
                />
                <span>Enable Rhythm Modulation</span>
              </label>
            </div>
          )}

          {/* Progress Bar */}
          {rhythmSettings.enabled && isRhythmPlaying && (
            <div className="rhythm-progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-info">
                <span className="current-freq">{currentRhythmFreq.toFixed(2)} Hz</span>
                <span className="progress-time">
                  {remainingTime > 0 && !rhythmSettings.loop
                    ? `${remainingTime.toFixed(1)}s remaining`
                    : rhythmSettings.loop
                    ? `Loop ${Math.floor(elapsedTime / rhythmSettings.duration) + 1}`
                    : 'Complete'}
                </span>
              </div>
            </div>
          )}

          {rhythmSettings.enabled && (
            <div className="rhythm-settings">
              {/* Presets */}
              <div className="rhythm-field full-width">
                <label className="rhythm-label">Quick Presets</label>
                <div className="rhythm-presets">
                  {rhythmPresets.map((preset) => (
                    <button
                      key={preset.name}
                      className="preset-card"
                      onClick={() => handlePresetSelect(preset)}
                      title={preset.description}
                      disabled={isRhythmPlaying ?? false}
                    >
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-name">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rhythm-row">
                <div className="rhythm-field">
                  <label className="rhythm-label">Start Frequency</label>
                  <div className="frequency-input-group">
                    <input
                      type="number"
                      className="rhythm-input"
                      value={rhythmSettings.startFrequency.toFixed(2)}
                      onChange={(e) => handleStartFreqChange(e.target.value)}
                      min="20"
                      max="20000"
                      step="0.01"
                      disabled={isRhythmPlaying ?? false}
                    />
                    <span className="input-unit">Hz</span>
                    <button
                      className="use-current-btn"
                      onClick={() => handleUseCurrentFrequency('start')}
                      title="Use current main frequency"
                      disabled={isRhythmPlaying ?? false}
                    >
                      ⟲
                    </button>
                  </div>
                </div>

                <div className="rhythm-field">
                  <label className="rhythm-label">End Frequency</label>
                  <div className="frequency-input-group">
                    <input
                      type="number"
                      className="rhythm-input"
                      value={rhythmSettings.endFrequency.toFixed(2)}
                      onChange={(e) => handleEndFreqChange(e.target.value)}
                      min="20"
                      max="20000"
                      step="0.01"
                      disabled={isRhythmPlaying ?? false}
                    />
                    <span className="input-unit">Hz</span>
                    <button
                      className="use-current-btn"
                      onClick={() => handleUseCurrentFrequency('end')}
                      title="Use current main frequency"
                      disabled={isRhythmPlaying ?? false}
                    >
                      ⟲
                    </button>
                  </div>
                </div>
              </div>

              <div className="rhythm-row">
                <div className="rhythm-field">
                  <label className="rhythm-label">Duration (seconds)</label>
                  <div className="duration-control">
                    <input
                      type="number"
                      className="rhythm-input"
                      value={rhythmSettings.duration.toFixed(1)}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      min="0.1"
                      max="60"
                      step="0.1"
                      disabled={isRhythmPlaying ?? false}
                    />
                    <div className="duration-presets">
                      {durationPresets.map((dur) => (
                        <button
                          key={dur}
                          className={`duration-preset-btn ${
                            rhythmSettings.duration === dur ? 'active' : ''
                          }`}
                          onClick={() => handleDurationPreset(dur)}
                          disabled={isRhythmPlaying ?? false}
                        >
                          {dur}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rhythm-field">
                  <label className="rhythm-label">
                    <input
                      type="checkbox"
                      className="rhythm-checkbox"
                      checked={rhythmSettings.loop}
                      onChange={handleLoopToggle}
                      disabled={isRhythmPlaying ?? false}
                    />
                    <span>Loop Continuously</span>
                  </label>
                </div>
              </div>

              <div className="rhythm-field full-width">
                <label className="rhythm-label">Transition Type</label>
                <div className="transition-buttons">
                  {(['linear', 'exponential', 'sine'] as RhythmTransitionType[]).map((type) => (
                    <button
                      key={type}
                      className={`transition-btn ${
                        rhythmSettings.transitionType === type ? 'active' : ''
                      }`}
                      onClick={() => handleTransitionChange(type)}
                      title={type === 'linear' ? 'Constant rate' : type === 'exponential' ? 'Musical intervals' : 'Wave-like'}
                      disabled={isRhythmPlaying ?? false}
                    >
                      <span className="transition-icon">{getTransitionIcon(type)}</span>
                      <span className="transition-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
