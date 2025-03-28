import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setLoading, setUser, setError } from '../store/slices/authSlice';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const response = await authService.login(email, password);
            const userData = response.data;
            dispatch(setUser(userData));
            navigate('/');
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(setError(error.message || '登录失败，请稍后再试'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>LoginPage</div>
    );
};

export default LoginPage; 