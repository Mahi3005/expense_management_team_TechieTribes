import React from 'react';
import { Outlet } from 'react-router-dom';
import ModeToggle from '@/components/mode-toggle';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 relative">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <div className="w-full flex items-center justify-center">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
