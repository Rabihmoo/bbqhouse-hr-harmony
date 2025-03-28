
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create the root and render the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Set element style to take full width and height
document.documentElement.style.width = '100%';
document.documentElement.style.height = '100vh';
document.documentElement.style.margin = '0';
document.documentElement.style.padding = '0';
document.body.style.width = '100%';
document.body.style.height = '100vh';
document.body.style.margin = '0';
document.body.style.padding = '0';
rootElement.style.width = '100%';
rootElement.style.height = '100vh';
rootElement.style.margin = '0';
rootElement.style.padding = '0';

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
