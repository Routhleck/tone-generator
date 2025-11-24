import type { NoiseType } from '../types';
import './NoiseSelector.css';

interface NoiseSelectorProps {
  selectedNoise: NoiseType;
  onNoiseChange: (noise: NoiseType) => void;
}

const noiseTypes: Array<{ type: NoiseType; label: string; description: string }> = [
  { type: 'white', label: 'White', description: 'Equal energy across all frequencies' },
  { type: 'pink', label: 'Pink', description: 'Equal energy per octave (1/f)' },
  { type: 'brown', label: 'Brown', description: 'Deep rumble (1/f²)' },
  { type: 'blue', label: 'Blue', description: 'High frequency emphasis' },
  { type: 'violet', label: 'Violet', description: 'Higher frequency emphasis' },
  { type: 'grey', label: 'Grey', description: 'Psychoacoustic equal loudness' },
];

export function NoiseSelector({ selectedNoise, onNoiseChange }: NoiseSelectorProps) {
  return (
    <div className="noise-selector">
      <h3 className="noise-title">Noise Type</h3>
      <div className="noise-grid">
        {noiseTypes.map(({ type, label, description }) => (
          <button
            key={type}
            className={`noise-button ${selectedNoise === type ? 'active' : ''}`}
            onClick={() => onNoiseChange(type)}
            aria-label={`Select ${label} noise`}
            aria-pressed={selectedNoise === type}
            title={description}
          >
            <span className="noise-label">{label}</span>
            <span className="noise-desc">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
