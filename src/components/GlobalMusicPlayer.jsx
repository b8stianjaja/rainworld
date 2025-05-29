// src/components/GlobalMusicPlayer.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store';

// Helper to format time (e.g., 0:00)
const formatTime = (timeInSeconds) => {
  const validTime = Number(timeInSeconds);
  if (isNaN(validTime) || validTime < 0 || !isFinite(validTime)) return "0:00";
  const minutes = Math.floor(validTime / 60);
  const seconds = Math.floor(validTime % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function GlobalMusicPlayer() {
  const { beat, isPlaying, volume, progress, duration, showPlayer } = useAppStore((state) => state.globalPlayerState);
  const {
    togglePlayerPlayPause,
    setPlayerVolume,
    updatePlayerTime,
    seekPlayerToProgress,
    hidePlayer,
    // playNextBeat, // For future "next" button functionality
    // playPreviousBeat, // For future "previous" button functionality
  } = useAppStore((state) => state); // Accessing actions directly

  const audioRef = useRef(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false);

  // Effect to handle audio source changes and play/pause commands from store
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !beat?.audioSrc) return;

    // If the beat source has changed, update it and load
    if (audioElement.src !== window.location.origin + beat.audioSrc) { // Ensure absolute path for comparison
      console.log("GlobalMusicPlayer: New beat source -", beat.audioSrc);
      audioElement.src = beat.audioSrc;
      audioElement.load(); // Important to load the new source
    }

    // Handle play/pause based on store state
    if (isPlaying) {
      audioElement.play().catch(e => console.warn("GlobalMusicPlayer: Audio play failed or interrupted.", e));
    } else {
      audioElement.pause();
    }
  }, [beat?.audioSrc, isPlaying]); // Dependency on beat.audioSrc ensures this runs when the beat changes

  // Effect to handle volume changes from store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Effect to handle seeking when progress changes in store (e.g., from clicking progress bar)
  // This effect runs if the user is NOT actively dragging the seek bar.
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && beat && isFinite(duration) && duration > 0 && !isUserSeeking) {
      const targetTime = progress * duration;
      // Only update if the difference is significant, to avoid fighting with onTimeUpdate
      if (Math.abs(audioElement.currentTime - targetTime) > 0.5) {
        audioElement.currentTime = targetTime;
      }
    }
  }, [progress, beat?.id, duration, isUserSeeking]); // Listen to progress changes from store

  // --- HTMLAudioElement Event Handlers ---
  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      updatePlayerTime(audioRef.current.currentTime, audioRef.current.duration);
    }
  }, [updatePlayerTime]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0 && !isUserSeeking) {
      updatePlayerTime(audioRef.current.currentTime, audioRef.current.duration);
    }
  }, [updatePlayerTime, isUserSeeking]);

  const onEnded = useCallback(() => {
    console.log("GlobalMusicPlayer: Beat ended.");
    togglePlayerPlayPause(); // Toggles to paused state, or implement play next
    // Or: playNextBeat(); 
  }, [togglePlayerPlayPause]);

  const onCanPlay = useCallback(() => {
    if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(e => console.warn("GlobalMusicPlayer: onCanPlay auto-play failed.", e));
    }
  }, [isPlaying]);


  // --- User Interaction Handlers for Progress Bar ---
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    seekPlayerToProgress(newProgress); // Update store's progress idea
    // If live seeking is desired while dragging:
    if (audioRef.current && isFinite(duration) && duration > 0) {
       audioRef.current.currentTime = newProgress * duration;
    }
  };

  if (!showPlayer || !beat) {
    return null; // Don't render if hidden or no beat is loaded
  }

  return (
    <div className="global-music-player"> {/* Add layout-stacked class here if you prefer that CSS layout */}
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onCanPlay={onCanPlay}
        // onError={(e) => console.error("Audio Error:", e)}
      />
      <div className="player-artwork">
        <img src={beat.artworkSrc || '/artworks/default_artwork.jpg'} alt={beat.title} />
      </div>
      <div className="player-info-progress">
        <div className="player-text-info">
          <h4>{beat.title}</h4>
          <p>{beat.genre}</p> {/* Or Artist Name if available */}
        </div>
        <div className="progress-bar-container">
          <span>{formatTime(get().globalPlayerState.currentTime)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress} // Controlled by store state
            onMouseDown={() => setIsUserSeeking(true)}
            onChange={handleProgressChange} // Handles visual update and actual seek
            onMouseUp={() => setIsUserSeeking(false)}
            className="progress-bar"
            title="Seek"
            aria-label="Playback progress"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-main-controls-volume">
        <div className="player-main-controls">
          {/* <button title="Previous"> PREV </button> // Placeholder for future */}
          <button onClick={togglePlayerPlayPause} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          {/* <button title="Next"> NEXT </button> // Placeholder for future */}
        </div>
        <div className="player-volume-control">
          {/* Volume Icon Placeholder */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setPlayerVolume(parseFloat(e.target.value))}
            title="Volume"
            aria-label="Volume control"
          />
        </div>
      </div>
      <button className="player-close-button" onClick={hidePlayer} title="Close Player" aria-label="Close player">✕</button>
    </div>
  );
}

export default React.memo(GlobalMusicPlayer); // Memoize as it might re-render often due to time updates