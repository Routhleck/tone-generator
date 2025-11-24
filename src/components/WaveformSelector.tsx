import type { WaveformType } from '../types';
import './WaveformSelector.css';

interface WaveformSelectorProps {
  selectedWaveform: WaveformType;
  onWaveformChange: (waveform: WaveformType) => void;
}

const waveforms: Array<{ type: WaveformType; label: string; icon: string }> = [
  { type: 'sine', label: 'Sine', icon: '∿' },
  { type: 'square', label: 'Square', icon: '⊓' },
  { type: 'sawtooth', label: 'Sawtooth', icon: '⋰' },
  { type: 'triangle', label: 'Triangle', icon: '△' },
];

export function WaveformSelector({
  selectedWaveform,
  onWaveformChange,
}: WaveformSelectorProps) {
  return (
    <div className="waveform-selector">
      <h3 className="waveform-title">Waveform</h3>
      <div className="waveform-buttons">
        {waveforms.map(({ type, label, icon }) => (
          <button
            key={type}
            className={`waveform-button ${
              selectedWaveform === type ? 'active' : ''
            }`}
            onClick={() => onWaveformChange(type)}
            aria-label={`Select ${label} waveform`}
            aria-pressed={selectedWaveform === type}
          >
            <span className="waveform-icon">{icon}</span>
            <span className="waveform-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
