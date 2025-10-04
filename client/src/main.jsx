import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
                <Toaster position="top-right" richColors />
                <App />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
