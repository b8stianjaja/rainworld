// src/components/BeatCard.jsx
import React from 'react';
import { useAppStore } from '../store';

function BeatCard({ beat }) {
  const playBeatInPlayer = useAppStore((state) => state.playBeatInPlayer);
  const openModal = useAppStore((state) => state.openModal);

  if (!beat) return null; // Should not happen if data is managed well

  const handlePlay = (e) => {
    e.stopPropagation(); // Prevent card click if only play button is intended
    playBeatInPlayer(beat);
  };

  const handleShowLicenseOptions = (e) => {
    e.stopPropagation(); // Prevent card click
    // The 'LicenseOptionsModal' string key should match what ModalRenderer expects
    openModal('LicenseOptions', { beat }); // Pass the beat data as props to the modal content
  };

  // Main card click can also play the beat, or navigate to a beat detail page in future
  const handleCardClick = () => {
    playBeatInPlayer(beat);
    // Or: setView(`BeatDetail/${beat.id}`); // For a future beat detail page
  };

  // Determine the starting price to display
  const startingPrice = beat.licenses?.basic?.price || beat.price || null;

  return (
    <div 
      className="beat-card" 
      onClick={handleCardClick} 
      title={`Play ${beat.title}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick();}}
    >
      <div className="beat-artwork-container">
        <img
          src={beat.artworkSrc || '/artworks/default_artwork.jpg'} // Fallback default artwork
          alt={`Artwork for ${beat.title}`}
          className="beat-artwork"
          loading="lazy" // Native lazy loading for images
        />
        <div className="artwork-play-overlay">▶</div>
      </div>
      <div className="beat-info">
        <h4 className="beat-title">{beat.title}</h4>
        <p className="beat-genre-mood">
          {beat.genre}
          {beat.mood && beat.mood.length > 0 ? ` | ${beat.mood.slice(0, 2).join(', ')}` : ''} 
          {/* Show first 2 moods or adjust */}
        </p>
        {startingPrice !== null && (
          <p className="beat-price">
            Starts at ${startingPrice.toFixed(2)}
          </p>
        )}
      </div>
      <div className="beat-actions">
        <button className="play-button" onClick={handlePlay} aria-label={`Play ${beat.title}`}>Play</button>
        <button className="license-button" onClick={handleShowLicenseOptions} aria-label={`View license options for ${beat.title}`}>License Info</button>
      </div>
    </div>
  );
}

export default React.memo(BeatCard); // Memoize for performance in lists