
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create the root and render the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Set all HTML elements to take full width and height of viewport
document.documentElement.style.width = '100%';
document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';
document.documentElement.style.padding = '0';
document.documentElement.style.overflow = 'hidden';

document.body.style.width = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';

rootElement.style.width = '100%';
rootElement.style.height = '100%';
rootElement.style.margin = '0';
rootElement.style.padding = '0';
rootElement.style.overflow = 'hidden';

// Add console log to help debug any rendering issues
console.log('Initializing BBQHOUSE HR Management System');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
