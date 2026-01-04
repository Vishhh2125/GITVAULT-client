import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import './index.css'
import App from './App.jsx'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>

    
       <Toaster
          position="top-right"
          toastOptions={{
            duration: 1000,
            style: {
              background: '#1a1d2e',
              color: '#e5e7eb',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px'
            },
            success: {
              style: {
                borderLeft: '4px solid #22c55e'
              }
            },
            error: {
              style: {
                borderLeft: '4px solid #ef4444'
              }
            }
          }}
        />

        <App />

      </BrowserRouter>
    </Provider>
  </StrictMode>
)
