import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../common/Notification.tsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { login, register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Redirecting
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const validatePassword = (password: string): { isValid: boolean; message: string } => {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        }

        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        }

        if (!/\d/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one special character' };
        }

        return { isValid: true, message: '' };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setNotification({
                message: passwordValidation.message,
                type: 'error'
            });
            return;
        }

        if (password !== confirmPassword) {
            setNotification({
                message: 'Passwords do not match',
                type: 'error'
            });
            return;
        }

        const success = register(username, password);
        if (!success) {
            setNotification({
                message: 'Username already exists',
                type: 'error'
            });
            return;
        }

        setNotification({
            message: 'Registration successful! Redirecting to login...',
            type: 'success'
        });

        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    const togglePasswordVisibility = (field: 'password' | 'confirm') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {notification && (
                    <Notification 
                        message={notification.message} 
                        type={notification.type} 
                    />
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('password')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                            Password must contain:
                            <ul className="list-disc ml-4">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Sign Up
                    </button>
                    <div className="text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-700">
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
