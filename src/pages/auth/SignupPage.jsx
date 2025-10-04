import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchCountries } from '@/constants/countries';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

const SignupPage = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);

    useEffect(() => {
        const loadCountries = async () => {
            setIsLoadingCountries(true);
            const data = await fetchCountries();
            setCountries(data);
            setIsLoadingCountries(false);
        };
        loadCountries();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleCountryChange = (value) => {
        setFormData({
            ...formData,
            country: value
        });
        if (errors.country) {
            setErrors({ ...errors, country: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.country) {
            newErrors.country = 'Please select a country';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            try {
                const selectedCountry = countries.find(c => c.code === formData.country);
                const signupData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    countryCode: formData.country,
                    baseCurrency: selectedCountry?.currency,
                    currencySymbol: selectedCountry?.symbol
                };

                console.log('Signup data:', signupData);

                // Add your signup API call here
                // await api.signup(signupData);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Success toast and redirect to login
                toast.success('Account created successfully! Please login.');
                navigate(ROUTES.LOGIN);
            } catch (error) {
                console.error('Signup error:', error);
                toast.error('Signup failed. Please try again.');
                setErrors({ submit: 'Signup failed. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md">
            <Card className="shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin (Company) Signup</CardTitle>
                    <CardDescription className="text-center text-sm text-red-500">
                        1 admin user per company
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
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
                                disabled={isLoading}
                                className="w-full"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full"
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country Selection</Label>
                            <Select
                                value={formData.country}
                                onValueChange={handleCountryChange}
                                disabled={isLoading || isLoadingCountries}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select a country"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            {country.name} ({country.currency})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.country && (
                                <p className="text-sm text-red-500">{errors.country}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                The selected country's currency will be set as your company's base currency
                            </p>
                        </div>

                        {errors.submit && (
                            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Signup'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-primary font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignupPage;
