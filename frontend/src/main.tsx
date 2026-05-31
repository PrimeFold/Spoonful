import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from '../components/theme-provider'
import { AuthProvider } from './context/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'
const client = queryClient;



createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>

 
)
