import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Toaster position="top-right" richColors />
            <App />
        </ThemeProvider>
    </StrictMode>,
)
