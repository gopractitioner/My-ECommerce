import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { productService } from '../services/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await productService.getProducts();
                // 随机选择最多6个产品作为特色产品
                const products = response.data;
                const randomProducts = products
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.min(6, products.length));
                setFeaturedProducts(randomProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('无法加载产品，请稍后再试');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16 rounded-lg mb-12">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">欢迎来到 MyEcommerce</h1>
                    <p className="text-xl mb-8">您的一站式购物平台，提供各种优质商品和服务。</p>
                    <Link
                        to="/products"
                        className="bg-white text-blue-600 px-6 py-3 rounded-md font-bold hover:bg-gray-100"
                    >
                        立即购物
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">特色商品</h2>

                {loading ? (
                    <div className="text-center py-10">加载中...</div>
                ) : error ? (
                    <div className="text-center text-red-600 py-10">{error}</div>
                ) : featuredProducts.length === 0 ? (
                    <div className="text-center py-10">没有可用的产品</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                                            无图片
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-blue-600">¥{product.price.toFixed(2)}</span>
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            查看详情
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-8">
                    <Link
                        to="/products"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        查看全部商品 &rarr;
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gray-100 py-12 rounded-lg">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center">为什么选择我们</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🚚
                            </div>
                            <h3 className="text-xl font-bold mb-2">免费配送</h3>
                            <p className="text-gray-600">所有订单均享有免费配送服务，购物无忧。</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                ⭐
                            </div>
                            <h3 className="text-xl font-bold mb-2">品质保证</h3>
                            <p className="text-gray-600">我们只提供高品质的商品，确保您的满意。</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🔒
                            </div>
                            <h3 className="text-xl font-bold mb-2">安全支付</h3>
                            <p className="text-gray-600">安全的支付系统，保障您的购物安全。</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage; 