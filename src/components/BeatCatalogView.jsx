// src/components/BeatCatalogView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store';
import BeatCard from './BeatCard';

function BeatCatalogView() {
  const allBeats = useAppStore((state) => state.beatCatalog);
  const filteredBeats = useAppStore((state) => state.filteredBeats);
  const setFilter = useAppStore((state) => state.setFilter);
  const clearFilters = useAppStore((state) => state.clearFilters);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(''); // Store the value directly
  const [selectedMood, setSelectedMood] = useState('');   // Store the value directly

  // Derive unique genres and moods from the full catalog for filter dropdowns
  const uniqueGenres = useMemo(() => {
    if (!allBeats || allBeats.length === 0) return ["All Genres"];
    const genres = new Set(allBeats.map(beat => beat.genre).filter(Boolean)); // Filter out undefined/null genres
    return ["All Genres", ...Array.from(genres).sort()];
  }, [allBeats]);

  const uniqueMoods = useMemo(() => {
    if (!allBeats || allBeats.length === 0) return ["All Moods"];
    const moods = new Set(allBeats.flatMap(beat => beat.mood || []).filter(Boolean)); // Ensure mood array exists and filter empty
    return ["All Moods", ...Array.from(moods).sort()];
  }, [allBeats]);

  // Effect to apply filters when local filter states change
  useEffect(() => {
    setFilter({ 
      query: searchTerm, 
      genre: selectedGenre, // Pass the value directly
      mood: selectedMood    // Pass the value directly
    });
  }, [searchTerm, selectedGenre, selectedMood, setFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre("All Genres"); // Reset to placeholder value
    setSelectedMood("All Moods");   // Reset to placeholder value
    // clearFilters(); // The useEffect above will trigger setFilter with empty values
    // which should achieve the same as clearFilters if store logic is set up for it.
    // Explicitly calling clearFilters is also fine if it directly resets to allBeats.
    setFilter({ query: '', genre: "All Genres", mood: "All Moods" });

  };

  return (
    <main className="beat-catalog-view ui-panel" aria-labelledby="catalog-title">
      <h2 id="catalog-title">The Beat Archives</h2>
      <div className="filters-section" role="search">
        <input
          type="search" // Use type="search" for semantics
          placeholder="Search by title, genre, mood..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
          aria-label="Search beats"
        />
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)} 
          className="filter-select"
          aria-label="Filter by genre"
        >
          {uniqueGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>
        <select 
          value={selectedMood} 
          onChange={(e) => setSelectedMood(e.target.value)} 
          className="filter-select"
          aria-label="Filter by mood"
        >
          {uniqueMoods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
        </select>
        <button onClick={handleClearFilters} className="secondary filter-button">Reset Filters</button>
      </div>

      {allBeats.length === 0 ? (
        <p>Summoning soundwaves... please wait or check back soon.</p>
      ) : filteredBeats.length > 0 ? (
        <div className="beat-grid" aria-live="polite"> {/* Announce changes for screen readers */}
          {filteredBeats.map(beat => <BeatCard key={beat.id} beat={beat} />)}
        </div>
      ) : (
        <p>No ancient melodies match your query. Try adjusting the runes (filters).</p>
      )}
    </main>
  );
}

export default BeatCatalogView;