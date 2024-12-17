import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

export const Login: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const { login, register, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (isRegistering) {
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                const success = await register(username.trim(), password);
                if (success) {
                    setRegistrationSuccess(true);
                    setIsRegistering(false);
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                await login(username.trim(), password);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>

                {registrationSuccess && !isRegistering && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
                        Account created successfully! Please log in.
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label 
                            htmlFor="username" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                            required
                            minLength={2}
                            maxLength={20}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    {isRegistering && (
                        <div>
                            <label 
                                htmlFor="confirmPassword" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
                                required
                                minLength={6}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        disabled={isLoading || !username.trim() || !password}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                            isRegistering ? 'Create Account' : 'Login'
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            if (!isLoading) {
                                setIsRegistering(!isRegistering);
                                setUsername('');
                                setPassword('');
                                setConfirmPassword('');
                                setRegistrationSuccess(false);
                            }
                        }}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                        disabled={isLoading}
                    >
                        {isRegistering 
                            ? 'Already have an account? Login' 
                            : 'Need an account? Register'}
                    </button>
                </div>
            </div>
        </div>
    );
}; 