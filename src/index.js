import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // React 18 방식
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
