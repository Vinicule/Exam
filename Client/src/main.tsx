import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx' // *** NEW: Import AuthProvider ***

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* *** NEW: Wrap App in AuthProvider *** */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
