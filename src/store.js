// src/store.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'; // Optional: for Redux DevTools

// --- Mock Beat Data (Replace with your actual data source/API call later) ---
// Ensure paths in `audioSrc` and `artworkSrc` point to files in your `public` folder.
// You'll need to create `/public/audio/` and `/public/artworks/` folders and add these assets.
const initialBeatsData = [
  { 
    id: 'beat001', 
    title: 'BEAT NUMERO 1', 
    genre: 'Epic Orchestral', 
    mood: ['cinematic', 'intense', 'heroic'], 
    bpm: 155, 
    key: 'E Minor', 
    licenses: { 
      basic: { name: 'Basic Lease', price: 34.99, details: "MP3 (320kbps) + WAV (24-bit). Non-exclusive. Sell up to 2,000 units. Streaming up to 500,000." }, 
      premium: { name: 'Premium Lease', price: 89.99, details: "MP3 + WAV + Stems. Non-exclusive. Sell up to 10,000 units. Streaming up to 1,000,000." }, 
      exclusive: { name: 'Exclusive Rights', price: 349.99, details: "Full ownership with Stems. Beat removed from store after purchase." } 
    }, 
    audioSrc: '/audio/WDR.mp3', // e.g., public/audio/beat001_preview.mp3
    artworkSrc: '/artworks/beat001.jpg',   // e.g., public/artworks/beat001.jpg
    featured: true, 
    durationSeconds: 190 // Approximate duration in seconds for the player
  },
  { 
    id: 'beat002', 
    title: 'Starlit Path', 
    genre: 'Chillhop Lo-fi', 
    mood: ['relaxing', 'dreamy', 'nostalgic'], 
    bpm: 82, 
    key: 'C Major', 
    licenses: { 
      basic: { name: 'Basic Lease', price: 29.99, details: "MP3 + WAV. Non-exclusive." },
      premium: { name: 'Premium Lease', price: 79.99, details: "MP3 + WAV + Stems. Non-exclusive." }
    }, 
    audioSrc: '/audio/beat002_preview.mp3', 
    artworkSrc: '/artworks/beat002.jpg', 
    durationSeconds: 165 
  },
  { 
    id: 'beat003', 
    title: 'Neon Grid Runner', 
    genre: 'Synthwave', 
    mood: ['energetic', '80s', 'driving'], 
    bpm: 128, 
    key: 'G Minor', 
    licenses: { 
      basic: { name: 'Basic Lease', price: 29.99, details: "MP3 + WAV. Non-exclusive." } 
    }, 
    audioSrc: '/audio/beat003_preview.mp3', 
    artworkSrc: '/artworks/beat003.jpg', 
    durationSeconds: 205 
  },
];

const initialState = {
  currentView: 'MainMenu', // Possible views: 'MainMenu', 'BeatCatalog', 'AboutArtist', 'Contact'
  beatCatalog: [],         // Will be populated by loadInitialBeats
  filteredBeats: [],       // For displaying search/filter results
  globalPlayerState: {
    beat: null,            // The beat object: { id, title, audioSrc, artworkSrc, durationSeconds }
    isPlaying: false,
    volume: 0.75,
    progress: 0,           // Playback progress from 0 to 1
    currentTime: 0,        // Current playback time in seconds
    duration: 0,           // Total duration of the current beat in seconds
    showPlayer: false,     // Controls visibility of the global player UI
  },
  modalState: {
    isOpen: false,
    contentKey: null,      // String key to determine which modal content to render (e.g., 'LicenseOptions')
    contentProps: {},      // Props to pass to the specific modal content component
  },
  // Cart functionality is omitted for this "cleaner point" to keep it streamlined,
  // but this is where you'd add `cartItems: []` and cart actions.
};

// Define actions in a separate function for clarity and correct `get`/`set` scoping
const storeActionsDefinition = (set, get) => ({
  // --- Initialization ---
  loadInitialBeats: () => {
    // In a real application, you would fetch this data from an API.
    // For this template, we simulate an asynchronous load with mock data.
    console.log("Store: Initializing beat catalog...");
    setTimeout(() => {
      set({ beatCatalog: initialBeatsData, filteredBeats: initialBeatsData });
      console.log("Store: Beat catalog loaded.");
    }, 100); // Short delay to mimic async behavior
  },

  // --- Navigation ---
  setView: (view) => {
    console.log(`Store: Setting view to - ${view}`);
    // Reset modal state when changing main views for a cleaner UX
    set({ currentView: view, modalState: { ...initialState.modalState, isOpen: false } });
  },

  // --- Beat Catalog & Filtering ---
  setFilter: (filterParams = { query: '', genre: '', mood: '' }) => {
    let result = get().beatCatalog;
    const queryLower = filterParams.query?.trim().toLowerCase();
    const genreValue = filterParams.genre; // Assuming exact match from select
    const moodValue = filterParams.mood;   // Assuming exact match from select

    if (queryLower) {
      result = result.filter(beat =>
        beat.title.toLowerCase().includes(queryLower) ||
        beat.genre.toLowerCase().includes(queryLower) ||
        (beat.mood && beat.mood.some(m => m.toLowerCase().includes(queryLower)))
      );
    }
    // Check if genreValue is not the placeholder "All Genres" or empty
    if (genreValue && genreValue.toLowerCase() !== "all genres") {
      result = result.filter(beat => beat.genre.toLowerCase() === genreValue.toLowerCase());
    }
    // Check if moodValue is not the placeholder "All Moods" or empty
    if (moodValue && moodValue.toLowerCase() !== "all moods") {
      result = result.filter(beat => beat.mood && beat.mood.map(m => m.toLowerCase()).includes(moodValue.toLowerCase()));
    }
    set({ filteredBeats: result });
  },
  clearFilters: () => set({ filteredBeats: get().beatCatalog }),

  // --- Global Music Player Actions ---
  playBeatInPlayer: (beatToPlay) => {
    if (!beatToPlay || !beatToPlay.audioSrc) {
      console.error("Store: Attempted to play invalid beat:", beatToPlay);
      return;
    }
    const currentBeat = get().globalPlayerState.beat;
    console.log(`Store: Global Player - Request to play ${beatToPlay.title}`);
    set((state) => ({
      globalPlayerState: {
        ...state.globalPlayerState,
        beat: beatToPlay,
        isPlaying: true,
        // Reset progress if it's a new beat or if current beat had finished and is re-clicked
        progress: (currentBeat?.id === beatToPlay.id && state.globalPlayerState.progress < 0.999) ? state.globalPlayerState.progress : 0,
        currentTime: (currentBeat?.id === beatToPlay.id && state.globalPlayerState.progress < 0.999) ? state.globalPlayerState.currentTime : 0,
        duration: beatToPlay.durationSeconds || state.globalPlayerState.duration || 0, // Use predefined or wait for metadata
        showPlayer: true,
      }
    }));
  },
  togglePlayerPlayPause: () => {
    if (!get().globalPlayerState.beat) return; // No beat loaded to toggle
    set((state) => ({
      globalPlayerState: { ...state.globalPlayerState, isPlaying: !state.globalPlayerState.isPlaying }
    }));
  },
  setPlayerVolume: (volume) => {
    set((state) => ({ globalPlayerState: { ...state.globalPlayerState, volume: Math.max(0, Math.min(1, volume)) } }));
  },
  updatePlayerTime: (currentTime, duration) => { // Called by the <audio> element's onTimeUpdate
    if (get().globalPlayerState.beat) { // Only update if a beat is loaded and player is shown
      set((state) => ({
        globalPlayerState: {
          ...state.globalPlayerState,
          currentTime,
          duration: duration || state.globalPlayerState.duration, // Update duration if player provides it (can change if src reloads)
          progress: (duration > 0) ? currentTime / duration : 0,
        }
      }));
    }
  },
  seekPlayerToProgress: (progress) => { // Called when user interacts with progress bar
    if (get().globalPlayerState.beat) {
      set((state) => ({
        globalPlayerState: { ...state.globalPlayerState, progress }
        // The GlobalMusicPlayer component will listen to 'progress' changes
        // and update its HTMLAudioElement.currentTime accordingly.
      }));
    }
  },
  hidePlayer: () => {
    set((state) => ({
      // Stop playback and clear beat info from player
      globalPlayerState: { ...state.globalPlayerState, isPlaying: false, showPlayer: false, beat: null, progress: 0, currentTime: 0, duration: 0 }
    }));
  },

  // --- Modal Actions ---
  openModal: (contentKey, props = {}) => {
    console.log(`Store: Opening modal - Key: ${contentKey}`);
    set({ modalState: { isOpen: true, contentKey: contentKey, contentProps: props } });
  },
  closeModal: () => {
    console.log("Store: Closing modal");
    set({ modalState: { ...initialState.modalState, isOpen: false } }); // Retain contentKey/Props briefly for fade-out animations if any
    // For immediate content clear: set({ modalState: { ...initialState.modalState } });
  },
});

// Create the store with devtools middleware for debugging
export const useAppStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      // Expose actions directly for easy destructuring and use in components
      // This also makes them available via get().actionName() if needed inside other actions
      ...storeActionsDefinition(set, get),
    }),
    { name: "BeatSellingPlatformStore" } // Name for Redux DevTools
  )
);

// --- Utility Selectors (Exported for direct use in components) ---
export const selectFeaturedBeat = (state) => state.beatCatalog.find(beat => beat.featured === true);
// Add other selectors as your application grows, e.g.:
// export const selectBeatById = (id) => (state) => state.beatCatalog.find(beat => beat.id === id);

// --- Initial Actions After Store Creation ---
// Load initial beats when the application starts.
// This line accesses the actions directly after they've been added to the store instance.
useAppStore.getState().loadInitialBeats();