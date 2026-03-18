import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Profile from './Profile.tsx'
import PublicProfile from './PublicProfile.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/p/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
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
