import React from 'react';
import { createRoot } from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm';
import { BrowserRouter } from 'https://cdn.jsdelivr.net/npm/react-router-dom@6.14.0/+esm';
import App from './App.jsx';
import "./index.css"

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);