import './PlaybackControl.css';

interface PlaybackControlProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlaybackControl({ isPlaying, onTogglePlay }: PlaybackControlProps) {
  return (
    <div className="playback-control">
      <button
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Stop playing' : 'Start playing'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <>
            <svg
              className="play-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
            <span className="play-text">Stop</span>
          </>
        ) : (
          <>
            <svg
              className="play-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5v14l11-7L8 5z"
                fill="currentColor"
              />
            </svg>
            <span className="play-text">Play</span>
          </>
        )}
      </button>
      <p className="playback-hint">Press Space to play/pause</p>
    </div>
  );
}
