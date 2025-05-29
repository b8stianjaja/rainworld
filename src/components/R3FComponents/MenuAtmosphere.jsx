// src/components/R3FComponents/MenuAtmosphere.jsx
import React from 'react';
import { Stars, Sparkles, Cloud } from '@react-three/drei';

// Note on frameloop="demand": Animations within this scene (like Cloud/Sparkles speed)
// will only progress when the canvas is explicitly invalidated or if their containing 
// components manage their own animation loops. For a mostly static atmospheric background,
// "demand" is excellent for performance.

export function MenuAtmosphere() {
  return (
    <>
      {/* --- Lighting --- */}
      <ambientLight intensity={0.25} /> {/* Soft overall light */}
      <pointLight
        position={[0, 10, -15]} // Positioned further back and up
        intensity={1.0}         // Main accent light
        color="#a385cc"         // Corresponds to CSS --color-primary-dim (from your palette)
        distance={70}           // How far the light reaches
        decay={1.5}             // How fast light diminishes
      />
      <directionalLight
        position={[-10, 15, 10]}
        intensity={0.15}
        color="#f0e8ff"         // Corresponds to CSS --color-text-strong
      />

      {/* --- Background Elements --- */}
      <Stars
        radius={120}      // How far out the stars are
        depth={60}        // Depth of the star field
        count={5500}      // Number of stars
        factor={4.5}      // Star size factor
        saturation={0}    // No color in stars, just brightness
        fade              // Stars fade in the distance
        speed={0.3}       // Subtle animation speed
      />

      {/* --- Atmospheric Effects --- */}
      <Sparkles
        count={70}
        scale={9}         // Scale of the sparkle particles area
        size={6}          // Size of individual particles
        speed={0.15}      // Slower for subtlety
        color="#d1b3ff"   // Corresponds to CSS --color-primary-accent
        opacity={0.6}
      />
      <Sparkles
        count={40}
        scale={14}        // Slightly larger area for these
        size={7}
        speed={0.1}
        color="#f0e8ff"   // Corresponds to CSS --color-text-strong (softer white sparkles)
        opacity={0.25}
      />

      {/* Subtle, distant clouds for more depth */}
      <Cloud
        position={[-10, -7, -30]} // X, Y, Z
        speed={0.05}               // Very slow movement
        segments={25}
        width={22}
        depth={1.8}
        opacity={0.1}              // Very subtle
        color="#161224"            // Corresponds to CSS --color-surface (dark cloud)
      />
      <Cloud
        position={[12, 9, -40]}    // Adjusted Y position
        speed={0.04}
        segments={35}
        width={28}
        depth={2.2}
        opacity={0.09}
        color="#201a38"            // Corresponds to CSS --color-surface-accent
      />
    </>
  );
}