import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setCurrentProduct, setError } from '../store/slices/productSlice';
import { productService } from '../services/productService';

const ProductDetailPage: React.FC = () => {
    const dispatch = useDispatch();
    const id = window.location.pathname.split('/').pop();

    const fetchProduct = useCallback(async (productId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await productService.getProduct(productId);
            dispatch(setCurrentProduct(response.data));
        } catch (err: unknown) {
            const error = err as Error;
            dispatch(setError(error.message || '获取商品详情失败'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            fetchProduct(parseInt(id));
        }
    }, [id, fetchProduct]);

    return (
        <div>ProductDetailPage</div>
    );
};

export default ProductDetailPage; 