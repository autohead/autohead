import { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, Car } from 'lucide-react';

interface SignInProps {
    onSignIn: (username: string, password: string) => void;
}

export default function SignInPage({ onSignIn }: SignInProps) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                onSignIn(username, password);
            }, 1000);
        }

    };

    const handleDemoLogin = () => {
        setUsername('admin@caraccessories.com');
        setPassword('admin123');
        setErrors({});
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
                        <Car className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-foreground mb-2">Car Accessories Admin</h1>
                    <p className="text-muted-foreground">Sign in to manage your inventory</p>
                </div>

                {/* Sign In Card */}
                <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (errors.username) setErrors({ ...errors, username: undefined });
                                    }}
                                    placeholder="Enter your username"
                                    className={`w-full pl-10 pr-4 py-3 bg-background border ${errors.username ? 'border-destructive' : 'border-border'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-destructive mt-1.5">{errors.username}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    placeholder="Enter your password"
                                    className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.password ? 'border-destructive' : 'border-border'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-muted-foreground">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-primary hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>

                        {/* Demo Login Button */}
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full py-3 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            Use Demo Credentials
                        </button>
                    </form>

                    {/* Footer */}
                    {/* <div className="mt-6 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <button className="text-primary hover:underline">
                                Contact Admin
                            </button>
                        </p>
                    </div> */}
                </div>



                {/* Footer Text */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    © {new Date().getFullYear()} Auto Head Admin. All rights reserved.
                </p>
            </div>
        </div>
    );



}