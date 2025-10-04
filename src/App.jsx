import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes/routes';
import { ThemeProvider } from "@/components/theme-provider"

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;