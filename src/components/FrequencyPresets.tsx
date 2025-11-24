import './FrequencyPresets.css';

interface FrequencyPresetsProps {
  onFrequencySelect: (frequency: number) => void;
  currentFrequency: number;
}

interface Preset {
  frequency: number;
  name: string;
  description: string;
  category: 'musical' | 'healing' | 'scientific';
}

const presets: Preset[] = [
  {
    frequency: 440,
    name: 'A4',
    description: 'Standard tuning pitch',
    category: 'musical',
  },
  {
    frequency: 432,
    name: 'Natural A',
    description: 'Natural tuning',
    category: 'healing',
  },
  {
    frequency: 528,
    name: 'Love Freq',
    description: 'Transformation & miracles',
    category: 'healing',
  },
  {
    frequency: 174,
    name: 'Foundation',
    description: 'Pain relief',
    category: 'healing',
  },
  {
    frequency: 639,
    name: 'Connection',
    description: 'Relationships',
    category: 'healing',
  },
  {
    frequency: 852,
    name: 'Intuition',
    description: 'Spiritual awareness',
    category: 'healing',
  },
  {
    frequency: 1000,
    name: '1 kHz',
    description: 'Reference tone',
    category: 'scientific',
  },
  {
    frequency: 10000,
    name: '10 kHz',
    description: 'High frequency test',
    category: 'scientific',
  },
];

export function FrequencyPresets({
  onFrequencySelect,
  currentFrequency,
}: FrequencyPresetsProps) {
  return (
    <div className="frequency-presets">
      <h3 className="presets-title">Quick Presets</h3>
      <div className="presets-grid">
        {presets.map((preset) => {
          const isActive = Math.abs(currentFrequency - preset.frequency) < 0.1;
          return (
            <button
              key={preset.frequency}
              className={`preset-button ${isActive ? 'active' : ''} ${preset.category}`}
              onClick={() => onFrequencySelect(preset.frequency)}
              title={preset.description}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-frequency">{preset.frequency} Hz</span>
              <span className="preset-description">{preset.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
