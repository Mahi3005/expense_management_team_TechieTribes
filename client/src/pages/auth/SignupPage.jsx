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
import { authAPI } from '@/api';
import { Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        country: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const loadCountries = async () => {
            setIsLoadingCountries(true);
            const data = await fetchCountries();
            
            // Sort countries alphabetically by name
            const sortedCountries = data.sort((a, b) => {
                const nameA = a.name?.common || a.name || '';
                const nameB = b.name?.common || b.name || '';
                return nameA.localeCompare(nameB);
            });
            
            setCountries(sortedCountries);
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
            newErrors.name = 'Your name is required';
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
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
                const selectedCountry = countries.find(c => 
                    (c.cca2 === formData.country) || 
                    (c.name?.common === formData.country)
                );
                
                const currencyCode = selectedCountry?.currencies 
                    ? Object.keys(selectedCountry.currencies)[0] 
                    : 'USD';
                
                const currencySymbol = selectedCountry?.currencies?.[currencyCode]?.symbol || '$';
                
                const signupData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'admin', // Admin signup
                    companyName: formData.companyName,
                    country: selectedCountry?.name?.common || formData.country,
                    currency: currencyCode,
                    currencySymbol: currencySymbol,
                    department: 'Management'
                };

                console.log('Signup data:', signupData);

                // Register user via API
                const response = await authAPI.register(signupData);
                
                console.log('Registration response:', response);

                // Success toast and redirect to login
                toast.success('Account created successfully! Please login with your credentials.');
                navigate(ROUTES.LOGIN);
            } catch (error) {
                console.error('Signup error:', error);
                toast.error(error.message || 'Signup failed. Please try again.');
                setErrors({ submit: error.message || 'Signup failed. Please try again.' });
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
                            <Label htmlFor="name">Your Name</Label>
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
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                type="text"
                                placeholder="Enter company name"
                                value={formData.companyName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full"
                            />
                            {errors.companyName && (
                                <p className="text-sm text-red-500">{errors.companyName}</p>
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
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
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
                                        <SelectItem 
                                            key={country.cca2 || country.name?.common} 
                                            value={country.cca2 || country.name?.common}
                                        >
                                            {country.name?.common || country.name} 
                                            {country.currencies && ` (${Object.keys(country.currencies)[0]})`}
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
