import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { setLoading, setError } from '../store/slices/cartSlice';
import { updateItemQuantity } from '../store/slices/cartSlice';
import { cartService } from '../services/cartService';
import { Layout } from '../components/Layout';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state: RootState) => state.cart);

    // 添加 loading 状态的处理
    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </Layout>
        );
    }

    // 添加错误状态的处理
    if (error) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </Layout>
        );
    }

    // 修改错误处理
    const handleQuantityChange = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            dispatch(setLoading(true));
            await cartService.updateCartItem(productId, newQuantity);
            dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(setError(error.message || '更新数量失败'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default CartPage; 