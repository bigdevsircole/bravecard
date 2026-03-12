import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: '#141414',
          border: '1px solid #2a2a2a',
          color: '#ffffff',
        },
      }}
    />
  </StrictMode>,
)
