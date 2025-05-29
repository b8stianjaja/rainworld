// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { useAppStore } from './store';

// Eagerly load MainMenu as it's the primary entry point & has the R3F background
import MainMenu from './components/MainMenu'; 

// Lazy load other views for better initial performance
const BeatCatalogView = React.lazy(() => import('./components/BeatCatalogView'));
// CORRECTED IMPORT: Match the filename AboutView.jsx
const LazyAboutView = React.lazy(() => import('./components/AboutView')); 
const LazyContactView = React.lazy(() => import('./components/ContactView'));
// const ServicesView = React.lazy(() => import('./components/ServicesView')); // Example for future expansion

// Global UI Elements
import GlobalMusicPlayer from './components/GlobalMusicPlayer';
import ModalRenderer from './components/ModalRenderer'; // Handles rendering different modals

// Error Boundary: Catches runtime errors in its children
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-ui ui-panel">
          <h2>A Crack in the Aether...</h2>
          <p>{this.state.error?.message || "An unexpected anomaly occurred. Attempting to recalibrate."}</p>
          {this.state.errorInfo && (
            <details>
              <summary>System Log</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button onClick={() => {
            useAppStore.getState().setView('MainMenu'); // Reset to MainMenu via store action
            this.setState({ hasError: false, error: null, errorInfo: null });
          }}>
            Return to Nexus (Menu)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Fallback loader for React.lazy Suspense (for lazy-loaded views)
function ViewLoaderFallback() {
  return <div className="view-loader ui-panel">Summoning Glyphs...</div>;
}

// Define known views for robust redirection. These strings MUST match the values
// you use when calling `setView()` in your store actions (e.g., from MainMenu buttons).
const KNOWN_VIEWS = ['MainMenu', 'BeatCatalog', 'AboutArtist', 'Contact' /*, 'ServicesView' */];

function App() {
  const currentView = useAppStore((state) => state.currentView);
  const globalPlayerState = useAppStore((state) => state.globalPlayerState);
  const modalState = useAppStore((state) => state.modalState);
  const setView = useAppStore((state) => state.setView);

  useEffect(() => {
    if (!KNOWN_VIEWS.includes(currentView)) {
      console.warn(`Unknown view "${currentView}" detected. Re-routing to MainMenu.`);
      setView('MainMenu');
    }
  }, [currentView, setView]);

  let activeViewComponent = null;
  switch (currentView) {
    case 'MainMenu':
      activeViewComponent = <MainMenu />;
      break;
    case 'BeatCatalog':
      activeViewComponent = <BeatCatalogView />;
      break;
    case 'AboutArtist': // This is the key used in setView('AboutArtist')
      activeViewComponent = <LazyAboutView />; // Render the correctly imported component
      break;
    case 'Contact': // This is the key used in setView('Contact')
      activeViewComponent = <LazyContactView />; // Render the correctly imported component
      break;
    // case 'ServicesView':
    //   activeViewComponent = <ServicesView />;
    //   break;
    default:
      activeViewComponent = <ViewLoaderFallback />; 
  }

  return (
    <div className={`app-shell theme-dark`}>
      <ErrorBoundary>
        {currentView === 'MainMenu' ? (
          activeViewComponent
        ) : (
          <Suspense fallback={<ViewLoaderFallback />}>
            {activeViewComponent}
          </Suspense>
        )}
      </ErrorBoundary>
      
      {globalPlayerState.showPlayer && <GlobalMusicPlayer />}
      {modalState.isOpen && <ModalRenderer />}
    </div>
  );
}

export default App;