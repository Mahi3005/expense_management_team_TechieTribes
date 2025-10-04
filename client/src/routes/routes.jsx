import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUserManagementPage } from '@/pages/admin/AdminUserManagementPage';
import { AdminApprovalRulesPage } from '@/pages/admin/AdminApprovalRulesPage';
import { AdminApprovalPage } from '@/pages/admin/AdminApprovalPage';
import { DashboardRouter } from '@/components/common/DashboardRouter';
import { RoleBasedRoute } from '@/components/common/RoleBasedRoute';
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
        path: ROUTES.DASHBOARD,
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <DashboardRouter />,
            },
            {
                path: ROUTES.USER_MANAGEMENT,
                element: (
                    <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                        <AdminUserManagementPage />
                    </RoleBasedRoute>
                ),
            },
            {
                path: ROUTES.APPROVALS,
                element: (
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminApprovalPage />
                    </RoleBasedRoute>
                ),
            },
            {
                path: ROUTES.APPROVAL_RULES,
                element: (
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminApprovalRulesPage />
                    </RoleBasedRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
]);

export default router;
