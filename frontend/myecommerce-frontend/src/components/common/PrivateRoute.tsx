import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // 可以在这里添加一个加载指示器
        return <div>加载中...</div>;
    }

    if (!user) {
        // 如果用户未登录，重定向到登录页面，并记录尝试访问的URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 如果用户已登录，显示子路由
    return <>{children}</>;
};

export default PrivateRoute; 