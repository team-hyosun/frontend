import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'

async function enableMswIfNeeded() {
  if (!(import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true')) return
  if (window.__MSW_STARTED__) return
  const { startMsw } = await import('./mocks/index.js')
  await startMsw({ onUnhandledRequest: 'bypass' })
  window.__MSW_STARTED__ = true
}

enableMswIfNeeded().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
