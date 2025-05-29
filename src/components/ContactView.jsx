// src/components/ContactView.jsx
import React, { useState } from 'react';

function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false); // Reset on new submission attempt
    setSubmitError(null);
    console.log("Form Data Submitted (placeholder):", formData);

    // --- Placeholder for actual form submission logic ---
    // In a real application, you would send this data to a backend,
    // or use a service like Formspree, Netlify Forms, EmailJS, etc.
    // Example with a timeout to simulate an API call:
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      // if (mockConditionToFail) throw new Error("Simulated server error.");
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("An error occurred while sending your message. Please try again later or contact directly via [your_email@example.com].");
    }
    // --- End of placeholder logic ---
  };

  return (
    <main className="contact-view ui-panel" aria-labelledby="contact-title">
      <h2 id="contact-title">Send a Signal Through the Aether</h2>
      
      {isSubmitted && (
        <div className="form-success-message" style={{color: 'var(--color-primary)', marginBottom: '20px', border: '1px solid var(--color-primary-dim)', padding: '10px', borderRadius: '4px'}}>
          <p>Your message has been transmitted! I will respond as soon as possible.</p>
        </div>
      )}
      {submitError && (
        <div className="form-error-message" style={{color: 'var(--color-error)', marginBottom: '20px', border: '1px solid var(--color-error)', padding: '10px', borderRadius: '4px'}}>
          <p>{submitError}</p>
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="contact-form">
          <p>
            For inquiries about custom beats, collaborations, licensing questions, or just to connect, please use the form below.
          </p>
          <div className="form-group">
            <label htmlFor="name">Your Appellation (Name):</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Frequency (Email):</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject of Transmission:</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message:</label>
            <textarea 
              id="message" 
              name="message" 
              rows="7" 
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div style={{ textAlign: 'center' }}> {/* Center the button */}
            <button type="submit" className="submit-button">Transmit Message</button>
          </div>
        </form>
      )}

      <div className="alternative-contact" style={{marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', textAlign: 'center'}}>
        <p>Alternatively, you can reach out directly via <a href="mailto:your_artist_email@example.com">your_artist_email@example.com</a></p>
        {/* Add Social Media Links Here */}
        {/* <p>Follow my sonic journeys: 
          <a href="#" style={{marginLeft: '10px'}}>SoundCloud</a> | 
          <a href="#" style={{marginLeft: '10px'}}>YouTube</a> | 
          <a href="#" style={{marginLeft: '10px'}}>Instagram</a>
        </p> */}
      </div>
    </main>
  );
}

export default ContactView;