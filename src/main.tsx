import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Start in dark mode when the device prefers it; the Settings page can change it
document.documentElement.classList.toggle(
  'ion-palette-dark',
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);