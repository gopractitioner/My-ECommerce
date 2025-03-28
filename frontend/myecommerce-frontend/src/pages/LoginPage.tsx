import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/api';
import Layout from '../components/layout/Layout';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(email, password);
            const userData = response.data;
            dispatch(setUser(userData));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data || '登录失败，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">电子邮箱</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 mb-2">密码</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Logining in...' : 'Login'}
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                还没有账号？{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700">
                    立即注册
                </Link>
            </p>
        </div>
    );
};

export default LoginPage; 