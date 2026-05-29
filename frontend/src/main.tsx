import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from '../components/theme-provider'
import { AuthProvider } from './context/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'


const client = queryClient;
const queryClientProvider = QueryClientProvider(client)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
