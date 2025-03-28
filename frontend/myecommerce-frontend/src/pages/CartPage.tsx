import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCartItems, updateItemQuantity, removeItem, clearCart } from '../store/slices/cartSlice';
import { cartService } from '../services/api';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state) => state.cart);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await cartService.getCart();
            dispatch(setCartItems(response.data));
        } catch (err: any) {
            console.error('Failed to fetch cart:', err);
        }
    };

    const handleQuantityChange = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            await cartService.updateCartItem(productId, newQuantity);
            dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
        } catch (err: any) {
            console.error('Failed to update quantity:', err);
        }
    };

    const handleRemoveItem = async (productId: number) => {
        try {
            await cartService.removeFromCart(productId);
            dispatch(removeItem(productId));
        } catch (err: any) {
            console.error('Failed to remove item:', err);
        }
    };

    const handleClearCart = async () => {
        try {
            await cartService.clearCart();
            dispatch(clearCart());
        } catch (err: any) {
            console.error('Failed to clear cart:', err);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const totalAmount = items.reduce(
        (sum: number, item) => sum + item.price * item.quantity,
        0
    );

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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">购物车</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">购物车是空的</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-primary"
                    >
                        继续购物
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        商品
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        单价
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        数量
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        小计
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="h-16 w-16 object-cover rounded"
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.productName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                ${item.price.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="px-2 py-1 border rounded-l hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-t border-b">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    className="px-2 py-1 border rounded-r hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-lg font-semibold">
                            总计: ${totalAmount.toFixed(2)}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleClearCart}
                                className="btn btn-secondary"
                            >
                                清空购物车
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary"
                            >
                                结算
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage; 