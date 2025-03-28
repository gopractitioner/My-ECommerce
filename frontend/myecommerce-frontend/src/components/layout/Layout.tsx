import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex items-center">
                                <span className="text-xl font-bold text-primary-600">MyEcommerce</span>
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600"
                                >
                                    Product List
                                </Link>
                                {user && (
                                    <Link
                                        to="/cart"
                                        className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600"
                                    >
                                        Cart
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">{user.username}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-secondary"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="btn btn-secondary">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                {<Outlet />}
            </main>

            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p>&copy; 2024 MyEcommerce. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout; 