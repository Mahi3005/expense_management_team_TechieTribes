import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            // Add your forgot password API call here
            console.log('Forgot password for:', email);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setEmailSent(true);
            toast.success('Password reset link sent to your email!');
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription className="text-center">
                            We've sent a password reset link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground text-center">
                            <p>Didn't receive the email? Check your spam folder or try again.</p>
                        </div>
                        <Button
                            onClick={() => setEmailSent(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Try another email
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-sm text-primary hover:underline"
                        >
                            Back to login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <Card className="shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and we'll send you a reset link
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
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link
                        to={ROUTES.LOGIN}
                        className="text-sm text-primary hover:underline"
                    >
                        Back to login
                    </Link>
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to={ROUTES.SIGNUP}
                            className="text-primary font-medium hover:underline"
                        >
                            Signup
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
