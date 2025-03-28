import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">关于我们</h3>
                        <p className="text-gray-300">
                            MyEcommerce是一家提供优质产品和服务的电商平台，我们致力于为客户提供最好的购物体验。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">快速链接</h3>
                        <ul>
                            <li className="mb-2">
                                <Link to="/" className="text-gray-300 hover:text-white">首页</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/products" className="text-gray-300 hover:text-white">商品</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/cart" className="text-gray-300 hover:text-white">购物车</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/orders" className="text-gray-300 hover:text-white">订单</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">联系我们</h3>
                        <ul>
                            <li className="mb-2 text-gray-300">邮箱: contact@myecommerce.com</li>
                            <li className="mb-2 text-gray-300">电话: 123-456-7890</li>
                            <li className="mb-2 text-gray-300">地址: 中国北京市朝阳区123号</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} MyEcommerce. 保留所有权利。</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 