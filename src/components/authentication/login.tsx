import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../common/Notification.tsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const success = login(username, password);

        if (!success) {
            setNotification({
                message: 'Invalid username or password',
                type: 'error'
            });
            return;
        }

        setNotification({
            message: 'Login successful! Redirecting...',
            type: 'success'
        });
        
        setTimeout(() => {
            navigate('/', { replace: true });
        }, 1500);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
                    <div className="mb-6">
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
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Login
                    </button>
                    <div className="text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                            Sign up here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
