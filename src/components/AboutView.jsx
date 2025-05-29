// src/components/AboutView.jsx
import React from 'react';
// You can import an image of the artist if you have one in /public/artworks/ or similar
// import artistImage from '/artworks/artist_profile.jpg'; 

function AboutArtistView() {
  return (
    <main className="about-view ui-panel" aria-labelledby="about-artist-title">
      <h2 id="about-artist-title">The Alchemist of Sound</h2>
      
      {/* Optional Artist Image Section */}
      {/* <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <img 
          src={artistImage} 
          alt="[Your Artist Name]" 
          style={{ 
            maxWidth: '250px', 
            width: '100%', 
            borderRadius: '50%', // Circular image
            border: '3px solid var(--color-primary-dim)',
            boxShadow: '0 0 15px var(--color-glow-secondary)'
          }} 
        />
      </div> */}

      <p>
        Welcome, seeker of unique soundscapes. I am [Your Artist Name], a composer and producer dedicated to crafting instrumental narratives that transport listeners to other realms. My journey into music began with [mention your origin story briefly - e.g., a fascination with game soundtracks, a specific instrument, a moment of inspiration].
      </p>
      <p>
        Influenced by [mention 2-3 key influences - e.g., legendary composers, specific genres, artistic movements], my work aims to blend [mention your style - e.g., epic orchestral arrangements with modern electronic textures, nostalgic retro waves with cinematic depth, or chill lo-fi beats for focused introspection]. Each track is more than just a beat; it's a meticulously crafted atmosphere, a story waiting to unfold in your project.
      </p>
      
      <h3>My Philosophy</h3>
      <p>
        I believe that music is a powerful conduit for emotion and storytelling. Whether you're a filmmaker, game developer, content creator, or fellow artist, my goal is to provide you with instrumental pieces that not only fit your vision but elevate it, adding depth, emotion, and a distinctive sonic identity.
      </p>

      <h3>Collaborations & Custom Work</h3>
      <p>
        Beyond the catalog, I'm also available for custom scoring and collaborative projects. If you have a specific vision that requires a unique sound, don't hesitate to reach out through the <button className="button-style secondary" onClick={() => useAppStore.getState().setView('Contact')} style={{padding: '5px 10px', fontSize: '0.9em', margin: '0 5px'}}>Contact</button> portal.
      </p>
      {/* Add more sections as needed: e.g., Gear, Process, Testimonials */}
    </main>
  );
}

// We need to import useAppStore if the button above is to work directly.
// However, for a purely informational component, it's often better to handle navigation
// via a global navigation system if this component were part of a larger layout.
// For simplicity here, if you uncomment the button, ensure useAppStore is imported.
// import { useAppStore } from '../store'; 

export default AboutArtistView;