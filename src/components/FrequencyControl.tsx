import { useState, useEffect } from 'react';
import './FrequencyControl.css';

interface FrequencyControlProps {
  frequency: number;
  onFrequencyChange: (frequency: number) => void;
  minFrequency?: number;
  maxFrequency?: number;
}

export function FrequencyControl({
  frequency,
  onFrequencyChange,
  minFrequency = 20,
  maxFrequency = 20000,
}: FrequencyControlProps) {
  const [inputValue, setInputValue] = useState(frequency.toFixed(2));

  useEffect(() => {
    setInputValue(frequency.toFixed(2));
  }, [frequency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let value = parseFloat(inputValue);

    if (isNaN(value)) {
      value = frequency;
    } else {
      value = Math.max(minFrequency, Math.min(maxFrequency, value));
    }

    onFrequencyChange(value);
    setInputValue(value.toFixed(2));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      e.currentTarget.blur();
    }
  };

  // Logarithmic scale for better control across the frequency range
  const frequencyToSlider = (freq: number) => {
    const minLog = Math.log(minFrequency);
    const maxLog = Math.log(maxFrequency);
    return ((Math.log(freq) - minLog) / (maxLog - minLog)) * 100;
  };

  const sliderToFrequency = (value: number) => {
    const minLog = Math.log(minFrequency);
    const maxLog = Math.log(maxFrequency);
    return Math.exp(minLog + (value / 100) * (maxLog - minLog));
  };

  return (
    <div className="frequency-control">
      <div className="frequency-display">
        <input
          type="text"
          className="frequency-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          aria-label="Frequency in Hz"
        />
        <span className="frequency-unit">Hz</span>
      </div>

      <div className="frequency-slider-container">
        <input
          type="range"
          className="frequency-slider"
          min="0"
          max="100"
          step="0.01"
          value={frequencyToSlider(frequency)}
          onChange={(e) => {
            const sliderValue = parseFloat(e.target.value);
            const freq = sliderToFrequency(sliderValue);
            onFrequencyChange(freq);
          }}
          aria-label="Frequency slider"
        />
        <div className="frequency-range-labels">
          <span>{minFrequency} Hz</span>
          <span>{maxFrequency} Hz</span>
        </div>
      </div>

      <div className="frequency-info">
        <p className="frequency-hint">
          Use arrow keys: ← → (±10 Hz) · Shift+← → (±1 Hz) · Ctrl+← → (±0.01 Hz)
        </p>
      </div>
    </div>
  );
}
