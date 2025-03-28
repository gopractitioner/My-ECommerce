import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setProducts, setLoading, setError } from '../store/slices/productSlice';
import { productService } from '../services/api';

const ProductListPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.product);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        fetchProducts();
    }, [query]);

    const fetchProducts = async () => {
        try {
            dispatch(setLoading(true));
            const response = await productService.searchProducts(query);
            dispatch(setProducts(response.data));
        } catch (err: any) {
            dispatch(setError(err.response?.data || '获取商品列表失败'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {query ? `搜索结果: ${query}` : '所有商品'}
                </h1>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">没有找到相关商品</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:transform hover:scale-105">
                                <div className="aspect-w-1 aspect-h-1">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                                        {product.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-primary-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            库存: {product.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductListPage; 