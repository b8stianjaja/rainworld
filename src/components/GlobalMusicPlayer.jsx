// src/components/GlobalMusicPlayer.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store'; // Assuming your store is exported as useAppStore

// Helper to format time (e.g., 0:00)
const formatTime = (timeInSeconds) => {
  const validTime = Number(timeInSeconds);
  if (isNaN(validTime) || validTime < 0 || !isFinite(validTime)) return "0:00";
  const minutes = Math.floor(validTime / 60);
  const seconds = Math.floor(validTime % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function GlobalMusicPlayer() {
  // Select necessary state slices and actions from Zustand for efficiency
  const globalPlayerState = useAppStore((state) => state.globalPlayerState);
  const { beat, isPlaying, volume, progress, currentTime, duration, showPlayer } = globalPlayerState;

  const togglePlayerPlayPause = useAppStore((state) => state.togglePlayerPlayPause);
  const setPlayerVolume = useAppStore((state) => state.setPlayerVolume);
  const updatePlayerTime = useAppStore((state) => state.updatePlayerTime);
  const seekPlayerToProgress = useAppStore((state) => state.seekPlayerToProgress);
  const hidePlayer = useAppStore((state) => state.hidePlayer);
  // const playNextBeat = useAppStore((state) => state.playNextBeat); // For future

  const audioRef = useRef(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false); // Local UI state for when user is dragging the progress bar

  // Effect 1: Handle changes to the beat source and play/pause state from the store
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (beat && beat.audioSrc) {
      const audioOrigin = window.location.origin; // For constructing absolute URL if needed
      const newAudioSrc = beat.audioSrc.startsWith('/') ? audioOrigin + beat.audioSrc : beat.audioSrc;

      if (audioElement.src !== newAudioSrc) {
        console.log("GlobalMusicPlayer: Setting new audio source -", newAudioSrc);
        audioElement.src = newAudioSrc;
        audioElement.load(); // Important to load the new source
        // Duration might become 0 or NaN until metadata loads for new src
        // updatePlayerTime(0, beat.durationSeconds || 0); // Optionally reset time display
      }

      // Handle play/pause based on store's isPlaying state
      if (isPlaying) {
        // Check if ready to play, then play
        if (audioElement.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA || audioElement.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            audioElement.play().catch(e => console.warn("GlobalMusicPlayer: Audio play() failed.", e));
        }
        // If not ready, the onCanPlay handler will attempt to play
      } else {
        audioElement.pause();
      }
    } else {
      // No beat, ensure audio is paused and source is cleared
      audioElement.pause();
      audioElement.src = "";
    }
  }, [beat, isPlaying]); // React to changes in the beat object itself or isPlaying state

  // Effect 2: Handle volume changes from the store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Effect 3: Handle programmatic seeking (when store.progress changes NOT by this component's slider drag)
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && beat && isFinite(globalPlayerState.duration) && globalPlayerState.duration > 0 && !isUserSeeking) {
      const targetTime = globalPlayerState.progress * globalPlayerState.duration;
      // Only seek if the difference is significant to avoid fighting with onTimeUpdate
      if (Math.abs(audioElement.currentTime - targetTime) > 0.5) { // 0.5s tolerance
        console.log(`GlobalMusicPlayer: Programmatic seek to progress ${globalPlayerState.progress} (time: ${targetTime.toFixed(2)}s)`);
        audioElement.currentTime = targetTime;
      }
    }
  }, [globalPlayerState.progress, beat?.id, globalPlayerState.duration, isUserSeeking]);


  // --- HTMLAudioElement Event Handlers (memoized with useCallback) ---
  const handleLoadedMetadata = useCallback(() => {
    const audioElement = audioRef.current;
    if (audioElement && isFinite(audioElement.duration)) {
      console.log("GlobalMusicPlayer: Metadata loaded. Duration:", audioElement.duration);
      updatePlayerTime(audioElement.currentTime, audioElement.duration);
    }
  }, [updatePlayerTime]);

  const handleTimeUpdate = useCallback(() => {
    const audioElement = audioRef.current;
    // Only update store if user is NOT actively seeking with this component's slider
    if (audioElement && isFinite(audioElement.duration) && audioElement.duration > 0 && !isUserSeeking) {
      updatePlayerTime(audioElement.currentTime, audioElement.duration);
    }
  }, [updatePlayerTime, isUserSeeking]);

  const handleAudioEnded = useCallback(() => {
    console.log("GlobalMusicPlayer: Beat ended.");
    if (isPlaying) { // If it was playing and ended, toggle to paused state
        togglePlayerPlayPause();
    }
    // Reset progress to the beginning. The player component will reflect this via its useEffect on progress.
    seekPlayerToProgress(0); 
    // Future: playNextBeat();
  }, [togglePlayerPlayPause, seekPlayerToProgress, isPlaying]);

  const handleCanPlay = useCallback(() => {
    const audioElement = audioRef.current;
    // If the store state says it should be playing, and audio is now ready, play it.
    if (audioElement && isPlaying) {
      audioElement.play().catch(e => console.warn("GlobalMusicPlayer: onCanPlay auto-play failed or interrupted.", e));
    }
  }, [isPlaying]);

  const handleAudioError = useCallback((e) => {
    console.error("GlobalMusicPlayer Audio Error:", e, audioRef.current?.error);
    // You could dispatch an action to the store to show an error message to the user.
    // Example: showErrorNotification("Error playing beat: " + beat?.title);
  }, []);


  // --- User Interaction Handlers for Progress Bar ---
  const handleProgressSliderChange = (e) => { // While dragging
    const newProgress = parseFloat(e.target.value);
    if (isUserSeeking && audioRef.current && isFinite(duration) && duration > 0) {
      // Update local display time immediately for responsiveness
      const newCurrentTime = newProgress * duration;
      // Optionally, update store's currentTime for visual feedback if your span reads from store.currentTime directly
      // For this setup, the input range value directly reflects the drag.
      // The final update to store.progress happens onMouseUp.
      // To make the time display update live: updatePlayerTime(newCurrentTime, duration);
      // However, this can make the store noisy. Better to let the input value control visual.
    }
  };
  
  const handleProgressMouseDown = () => {
    setIsUserSeeking(true);
    // Optional: Pause playback while seeking for a smoother experience on some browsers/connections
    // if (isPlaying && audioRef.current) { audioRef.current.pause(); }
  };

  const handleProgressMouseUp = (e) => {
    const audioElement = audioRef.current;
    if (!audioElement || !isFinite(duration) || duration <= 0) {
        setIsUserSeeking(false);
        return;
    }
    const newProgress = parseFloat(e.target.value);
    audioElement.currentTime = newProgress * duration; // Set the audio time
    seekPlayerToProgress(newProgress); // Update the store with the final progress
    
    setIsUserSeeking(false);
    // If it was playing before seeking, resume playback
    // if (isPlaying && audioElement) { audioElement.play().catch(e => console.warn(e)); }
  };


  // --- Render Logic ---
  if (!showPlayer || !beat) {
    return null; // Don't render if hidden or no beat is loaded
  }

  return (
    <div className="global-music-player"> {/* Consider adding 'layout-stacked' class via CSS if you prefer that layout */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onCanPlay={onCanPlay}
        onError={handleAudioError}
        preload="metadata" // Good default, browsers may upgrade to "auto"
      />
      <div className="player-artwork">
        <img src={beat.artworkSrc || '/artworks/default_artwork.jpg'} alt={`Artwork for ${beat.title}`} />
      </div>
      <div className="player-info-progress">
        <div className="player-text-info">
          <h4>{beat.title}</h4>
          <p>{beat.genre}</p> {/* Or Artist Name if available */}
        </div>
        <div className="progress-bar-container">
          <span aria-label="Current time">{formatTime(isUserSeeking ? progress * duration : currentTime)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001" // Finer steps for smoother seeking
            value={progress} // Always reflects store state for consistency
            onMouseDown={handleProgressMouseDown}
            onChange={handleProgressSliderChange} // Handles visual feedback during drag
            onMouseUp={handleProgressMouseUp}   // Handles final seek and store update
            className="progress-bar"
            title="Seek"
            aria-label="Playback progress"
          />
          <span aria-label="Total duration">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-main-controls-volume">
        <div className="player-main-controls">
          {/* Add Previous/Next buttons here in the future if desired */}
          <button onClick={togglePlayerPlayPause} title={isPlaying ? 'Pause' : 'Play'} aria-pressed={isPlaying}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </div>
        <div className="player-volume-control">
          {/* Consider adding a volume icon here */}
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

export default React.memo(GlobalMusicPlayer);