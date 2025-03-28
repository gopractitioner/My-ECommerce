import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                    <Link to="/" className="text-2xl font-bold text-blue-600">MyEcommerce</Link>
                </div>

                <form onSubmit={handleSearch} className="w-full md:w-1/3 mb-4 md:mb-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索商品..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 mt-2 mr-4 text-gray-400 hover:text-gray-600"
                        >
                            🔍
                        </button>
                    </div>
                </form>

                <nav className="flex items-center">
                    <Link to="/products" className="px-4 py-2 text-gray-700 hover:text-blue-600">商品</Link>

                    {user ? (
                        <>
                            <Link to="/cart" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                                购物车
                            </Link>
                            <Link to="/orders" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                                订单
                            </Link>
                            <div className="relative group">
                                <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                                    {user.username}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        个人信息
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        退出登录
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">登录</Link>
                            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                注册
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header; 