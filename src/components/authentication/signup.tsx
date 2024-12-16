import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const result = await signup(formData.username, formData.password);
            setSuccessMessage(result.message);
            // Clear the form
            setFormData({
                username: '',
                password: '',
                confirmPassword: ''
            });
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="m-auto w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Create Account
                    </h2>
                    
                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 rounded bg-green-100 border border-green-400 text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link 
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
