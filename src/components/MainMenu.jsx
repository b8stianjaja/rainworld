// src/components/MainMenu.jsx
import React, { Suspense } from 'react';
import { useAppStore, selectFeaturedBeat } from '../store';
import { Canvas } from '@react-three/fiber';
// This is the critical import line:
import { MenuAtmosphere } from './R3FComponents/MenuAtmosphere'; 

function MainMenu() {
  const setView = useAppStore((state) => state.setView);
  const playBeatInPlayer = useAppStore((state) => state.playBeatInPlayer);
  const featuredBeat = useAppStore(selectFeaturedBeat);

  return (
    <div className="main-menu-container">
      <div className="main-menu-r3f-bg">
        <Canvas
          camera={{ position: [0, 0.5, 7], fov: 60, near: 0.1, far: 1000 }}
          shadows={false}
          gl={{ antialias: true, alpha: false }}
          frameloop="demand" 
        >
          <Suspense fallback={null}>
            <MenuAtmosphere />
          </Suspense>
        </Canvas>
      </div>

      <div className="main-menu-content-overlay ui-panel">
        <h1 className="main-menu-title">[YOUR ARTIST NAME]</h1>
        <p className="main-menu-subtitle">Echoes from the Void</p>

        <nav className="main-menu-nav">
          <button onClick={() => setView('BeatCatalog')}>Explore Archives (Beats)</button>
          <button onClick={() => setView('AboutArtist')}>The Alchemist (About)</button>
          <button onClick={() => setView('Contact')}>Send Signal (Contact)</button>
        </nav>

        {featuredBeat && (
          <div className="featured-beat-section">
            <h3>Featured Resonance</h3>
            <div 
              className="featured-beat-card" 
              onClick={() => playBeatInPlayer(featuredBeat)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') playBeatInPlayer(featuredBeat);}}
            >
              <img 
                src={featuredBeat.artworkSrc || '/artworks/default_artwork.jpg'}
                alt={`Artwork for ${featuredBeat.title}`} 
                className="featured-beat-artwork" 
              />
              <div className="featured-beat-text">
                <h4>{featuredBeat.title}</h4>
                <p>{featuredBeat.genre}</p>
              </div>
              <div className="play-icon-overlay">▶</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainMenu;