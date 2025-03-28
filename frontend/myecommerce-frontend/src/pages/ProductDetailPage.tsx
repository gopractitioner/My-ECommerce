import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentProduct, setLoading, setError } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';
import { productService, cartService } from '../services/api';
import Layout from '../components/layout/Layout';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentProduct, loading, error } = useAppSelector((state) => state.product);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct(parseInt(id));
        }
    }, [id]);

    const fetchProduct = async (productId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await productService.getProduct(productId);
            dispatch(setCurrentProduct(response.data));
        } catch (err: any) {
            dispatch(setError(err.response?.data || '获取商品详情失败'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > (currentProduct?.stock || 0)) return;
        setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        if (!currentProduct) return;

        try {
            setAddingToCart(true);
            await cartService.addToCart(currentProduct.id, quantity);
            dispatch(addItem({
                productId: currentProduct.id,
                productName: currentProduct.name,
                price: currentProduct.price,
                quantity,
                imageUrl: currentProduct.imageUrl,
            }));
            setAddToCartSuccess(true);
            setTimeout(() => setAddToCartSuccess(false), 2000);
        } catch (err: any) {
            console.error('Failed to add to cart:', err);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </Layout>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || '商品不存在'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={currentProduct.imageUrl}
                        alt={currentProduct.name}
                        className="w-full h-96 object-cover rounded-lg"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentProduct.name}
                    </h1>
                    <p className="text-2xl font-bold text-primary-600 mb-4">
                        ${currentProduct.price.toFixed(2)}
                    </p>
                    <p className="text-gray-600 mb-6">{currentProduct.description}</p>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">商品规格</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(currentProduct.attributes || {}).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-3 rounded">
                                    <span className="text-gray-600">{key}:</span>
                                    <span className="ml-2 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="px-3 py-1 border rounded-l hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-4 py-1 border-t border-b">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                className="px-3 py-1 border rounded-r hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            库存: {currentProduct.stock}
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || currentProduct.stock === 0}
                            className="btn btn-primary flex-1"
                        >
                            {addingToCart ? '添加中...' : '加入购物车'}
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="btn btn-secondary"
                        >
                            查看购物车
                        </button>
                    </div>

                    {addToCartSuccess && (
                        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            已成功添加到购物车
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 