// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';      // We will create App.jsx next
import './styles.css';   // We will create styles.css next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);