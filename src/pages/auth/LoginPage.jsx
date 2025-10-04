import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { mockLoginCredentials } from '@/constants/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

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
            // Check credentials against mock data
            const user = mockLoginCredentials.find(
                (cred) => cred.username === formData.username && cred.password === formData.password
            );

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (user) {
                login(user);
                toast.success('Login successful!', {
                    description: `Welcome back, ${user.name}!`,
                });
                
                // Navigate to dashboard after success
                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD);
                }, 500);
            } else {
                toast.error('Invalid credentials', {
                    description: 'Please check your username and password.',
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
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
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter username (e.g., jj)"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Login'}
                        </Button>
                    </form>
                    
                    {/* Demo Credentials Info */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                            <p><span className="font-medium">Admin:</span> username: jj, password: 123</p>
                            <p><span className="font-medium">Manager:</span> username: john, password: 123</p>
                            <p><span className="font-medium">Employee:</span> username: sarah, password: 123</p>
                        </div>
                    </div>
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
