import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { authAPI } from '@/api';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Attempting login with:', { email: formData.email });
            
            // Call real backend API
            const response = await authAPI.login({
                email: formData.email,
                password: formData.password
            });

            console.log('Login response:', response);

            if (response.success && response.data) {
                const { token, user, company } = response.data;
                
                console.log('Login successful - User:', user);
                console.log('Login successful - Company:', company);
                console.log('Login successful - Token:', token);
                
                // Store token, user, and company in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role);
                if (company) {
                    localStorage.setItem('company', JSON.stringify(company));
                    localStorage.setItem('currency', company.currency);
                    localStorage.setItem('currencySymbol', company.currencySymbol);
                }
                
                // Update auth context
                login(user);
                
                console.log('Auth context updated, navigating to dashboard...');
                
                toast.success('Login successful!', {
                    description: `Welcome back to ${company?.name || 'your company'}!`,
                });
                
                // Navigate to dashboard (DashboardRouter will handle role-based routing)
                setTimeout(() => {
                    console.log('Navigating to:', ROUTES.DASHBOARD);
                    navigate(ROUTES.DASHBOARD);
                }, 500);
            } else {
                console.error('Login failed - Invalid response format:', response);
                toast.error('Invalid credentials', {
                    description: 'Please check your email and password.',
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Login failed', {
                description: error.message || 'Please check your credentials and try again.',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <Card className="shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email (e.g., jj@g.c)"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Login'}
                        </Button>
                    </form>
                    
                    {/* Demo Credentials Info */}
                    {/* <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                            <p><span className="font-medium">Admin:</span> username: jj, password: 123</p>
                            <p><span className="font-medium">Manager:</span> username: john, password: 123</p>
                            <p><span className="font-medium">Employee:</span> username: sarah, password: 123</p>
                        </div>
                    </div> */}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to={ROUTES.SIGNUP}
                            className="text-primary font-medium hover:underline"
                        >
                            Signup
                        </Link>
                    </div>
                    <Link
                        to={ROUTES.FORGOT_PASSWORD}
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
