import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import { ROUTES } from '@/constants/routes';

// Main routes configuration
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTES.SIGNUP,
                element: <SignupPage />,
            },
            {
                path: ROUTES.FORGOT_PASSWORD,
                element: <ForgotPasswordPage />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
]);

export default router;
