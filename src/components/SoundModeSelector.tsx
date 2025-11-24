import type { SoundMode } from '../types';
import './SoundModeSelector.css';

interface SoundModeSelectorProps {
  soundMode: SoundMode;
  onSoundModeChange: (mode: SoundMode) => void;
}

export function SoundModeSelector({ soundMode, onSoundModeChange }: SoundModeSelectorProps) {
  return (
    <div className="sound-mode-selector">
      <div className="mode-toggle">
        <button
          className={`mode-button ${soundMode === 'tone' ? 'active' : ''}`}
          onClick={() => onSoundModeChange('tone')}
          aria-pressed={soundMode === 'tone'}
        >
          <span className="mode-icon">♪</span>
          <span className="mode-label">Tone</span>
        </button>
        <button
          className={`mode-button ${soundMode === 'noise' ? 'active' : ''}`}
          onClick={() => onSoundModeChange('noise')}
          aria-pressed={soundMode === 'noise'}
        >
          <span className="mode-icon">≈</span>
          <span className="mode-label">Noise</span>
        </button>
        <button
          className={`mode-button ${soundMode === 'rhythm' ? 'active' : ''}`}
          onClick={() => onSoundModeChange('rhythm')}
          aria-pressed={soundMode === 'rhythm'}
        >
          <span className="mode-icon">⟿</span>
          <span className="mode-label">Rhythm</span>
        </button>
        <div className={`mode-indicator ${soundMode}`} />
      </div>
    </div>
  );
}
