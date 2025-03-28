import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';
import { orderService } from '../services/api';
import Layout from '../components/layout/Layout';

interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

const CreateOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state) => state.cart) as { items: CartItem[] };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await orderService.createOrder(shippingAddress);
            dispatch(clearCart());
            navigate('/orders');
        } catch (err: any) {
            setError(err.response?.data || '创建订单失败，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">确认订单</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="card mb-6">
                <h2 className="text-lg font-semibold mb-4">订单商品</h2>
                {items.map((item: CartItem) => (
                    <div key={item.productId} className="flex items-center mb-4">
                        <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4">
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="text-gray-600">
                                数量: {item.quantity} × ${item.price}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="border-t pt-4">
                    <p className="text-lg font-semibold">
                        总计: ${totalAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <h2 className="text-lg font-semibold mb-4">收货信息</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            收货人姓名
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={shippingAddress.fullName}
                            onChange={handleInputChange}
                            className="input mt-1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            详细地址
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingAddress.address}
                            onChange={handleInputChange}
                            className="input mt-1"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                城市
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingAddress.city}
                                onChange={handleInputChange}
                                className="input mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                邮政编码
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={shippingAddress.postalCode}
                                onChange={handleInputChange}
                                className="input mt-1"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                国家
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={shippingAddress.country}
                                onChange={handleInputChange}
                                className="input mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                联系电话
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleInputChange}
                                className="input mt-1"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? '提交订单中...' : '提交订单'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrderPage; 