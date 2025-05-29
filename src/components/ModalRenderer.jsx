// src/components/ModalRenderer.jsx
import React, { useEffect } from 'react';
import { useAppStore } from '../store';

// Import specific modal content components here
import LicenseOptionsModal from './modals/LicenseOptionsModal';
// import AnotherModalType from './modals/AnotherModalType'; // Example

// Mapping of content keys (from store) to actual modal content components
const MODAL_COMPONENTS = {
  LicenseOptions: LicenseOptionsModal,
  // Notification: NotificationModal, // Example
  // ConfirmAction: ConfirmActionModal, // Example
};

function ModalRenderer() {
  const { isOpen, contentKey, contentProps } = useAppStore((state) => state.modalState);
  const closeModal = useAppStore((state) => state.closeModal);

  // Effect for closing modal with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeModal]);

  if (!isOpen || !contentKey) {
    return null; // Don't render anything if modal is not open or no content key
  }

  const SpecificModalContent = MODAL_COMPONENTS[contentKey];

  if (!SpecificModalContent) {
    console.warn(`ModalRenderer: No component found for contentKey "${contentKey}"`);
    return ( // Fallback if contentKey is invalid
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
            <div className="modal-content ui-panel" onClick={(e) => e.stopPropagation()} role="document">
                <button className="modal-close-button" onClick={closeModal} aria-label="Close modal">✕</button>
                <p>Error: Modal content could not be loaded.</p>
                 <button onClick={closeModal} className="secondary" style={{marginTop: '15px'}}>Close</button>
            </div>
        </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* The actual modal box, click propagation stopped to prevent overlay click */}
      <div className="modal-content ui-panel" onClick={(e) => e.stopPropagation()} role="document">
        <button className="modal-close-button" onClick={closeModal} aria-label="Close modal" title="Close">✕</button>
        {/* Render the specific modal content component with its props */}
        <SpecificModalContent {...contentProps} />
      </div>
    </div>
  );
}

export default ModalRenderer;