import './OctaveButtons.css';

interface OctaveButtonsProps {
  onHalveFrequency: () => void;
  onDoubleFrequency: () => void;
}

export function OctaveButtons({
  onHalveFrequency,
  onDoubleFrequency,
}: OctaveButtonsProps) {
  return (
    <div className="octave-buttons">
      <h3 className="octave-title">Octave</h3>
      <div className="octave-button-group">
        <button
          className="octave-button"
          onClick={onHalveFrequency}
          aria-label="Halve frequency (down one octave)"
        >
          <span className="octave-symbol">×½</span>
          <span className="octave-description">Down</span>
        </button>
        <button
          className="octave-button"
          onClick={onDoubleFrequency}
          aria-label="Double frequency (up one octave)"
        >
          <span className="octave-symbol">×2</span>
          <span className="octave-description">Up</span>
        </button>
      </div>
    </div>
  );
}
