import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {
    /* ignore */
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
