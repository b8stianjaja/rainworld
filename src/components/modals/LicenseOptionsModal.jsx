// src/components/modals/LicenseOptionsModal.jsx
import React from 'react';
import { useAppStore } from '../../store'; // To access actions like addToCart, closeModal

function LicenseOptionsModal({ beat }) { // 'beat' object will be passed as a prop from modalState.contentProps
  const closeModal = useAppStore((state) => state.closeModal);
  // const addToCart = useAppStore((state) => state.addToCart); // If cart was implemented

  if (!beat || !beat.licenses) {
    return (
      <div className="license-options-modal">
        <h3>Licensing Information Unavailable</h3>
        <p>Sorry, detailed licensing information for "{beat?.title || 'this beat'}" is currently not available.</p>
        <button onClick={closeModal} className="secondary" style={{ marginTop: '20px', width: '100%' }}>Close</button>
      </div>
    );
  }

  const handleAddToCart = (licenseType) => {
    console.log(`Modal: Adding ${beat.title} - ${licenseType} to cart (functionality placeholder)`);
    // In a real app with cart:
    // addToCart(beat.id, licenseType); 
    alert(`"${beat.title}" (${beat.licenses[licenseType].name}) added to cart (placeholder).`);
    closeModal();
  };

  return (
    <div className="license-options-modal">
      <h3>{beat.title} - License Options</h3>
      {Object.entries(beat.licenses).map(([type, details]) => (
        <div key={type} className="license-option">
          <div className="license-info">
            <strong>{details.name}</strong>
            <p className="license-details">{details.details}</p>
          </div>
          <div className="license-action">
            <span className="license-price">${details.price.toFixed(2)}</span>
            {/* ACTION: Replace alert with actual addToCart(beat.id, type) when cart is implemented */}
            <button onClick={() => handleAddToCart(type)}> 
              Select (${details.price.toFixed(2)})
            </button>
          </div>
        </div>
      ))}
      <button onClick={closeModal} className="secondary" style={{ marginTop: '25px', width: 'calc(100% - 20px)', margin: '25px 10px 0 10px' }}>
        Maybe Later
      </button>
    </div>
  );
}

export default LicenseOptionsModal;