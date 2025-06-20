import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerSW } from 'virtual:pwa-register'

if (navigator.storage && navigator.storage.persist)
{
  navigator.storage.persist().catch(() =>
  {
    /* ignore */
  })
}

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// ----------  ADD THIS — logs render errors ----------
window.addEventListener('error', e => console.error('GlobalError:', e.error || e));
