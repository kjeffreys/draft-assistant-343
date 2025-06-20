// src/main.tsx
//--------------------------------------------------------------------
// 0  – diagnostic logs to confirm the bundle really runs in the browser
//--------------------------------------------------------------------
console.log('🚀 bundle loaded');

const rootElem = document.getElementById('root');
console.log('💡 root element =', rootElem);

if (!rootElem)
{
  // Makes the real problem obvious in DevTools
  throw new Error('❌ <div id="root"> not found in index.html');
}

//--------------------------------------------------------------------
// 1  – existing imports and PWA helpers
//--------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Persist storage (your original logic)
if (navigator.storage && navigator.storage.persist)
{
  navigator.storage.persist().catch(() =>
  {
    /* ignore */
  });
}

// Register the service-worker (your original logic)
registerSW({ immediate: true });

//--------------------------------------------------------------------
// 2  – render the React tree
//--------------------------------------------------------------------
ReactDOM.createRoot(rootElem).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

//--------------------------------------------------------------------
// 3  – global error listener so *any* render-phase crash is visible
//--------------------------------------------------------------------
window.addEventListener('error', (e) =>
  console.error('GlobalError:', e.error || e),
);
