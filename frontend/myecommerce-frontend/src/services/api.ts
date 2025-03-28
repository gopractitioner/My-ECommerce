import axios from 'axios';

const API_URL = 'http://localhost:5075/api';

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器，添加token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器，处理错误
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 处理401未授权错误
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 用户认证服务
export const authService = {
    register: (username: string, email: string, password: string) =>
        apiClient.post('/Auth/register', { username, email, password }),

    login: (email: string, password: string) =>
        apiClient.post('/Auth/login', { email, password })
};

// 商品服务
export const productService = {
    getProducts: () =>
        apiClient.get('/Products'),

    getProduct: (id: number) =>
        apiClient.get(`/Products/${id}`),

    searchProducts: (query: string) =>
        apiClient.get(`/Products/search?q=${query}`)
};

// 购物车服务
export const cartService = {
    getCart: () =>
        apiClient.get('/Cart'),

    addToCart: (productId: number, quantity: number) =>
        apiClient.post('/Cart', { productId, quantity }),

    updateCartItem: (productId: number, quantity: number) =>
        apiClient.put(`/Cart/${productId}`, quantity),

    removeFromCart: (productId: number) =>
        apiClient.delete(`/Cart/${productId}`),

    clearCart: () =>
        apiClient.delete('/Cart')
};

// 订单服务
export const orderService = {
    createOrder: (shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    }) => apiClient.post('/Orders', { shippingAddress }),

    getOrders: () =>
        apiClient.get('/Orders'),

    getOrder: (id: number) =>
        apiClient.get(`/Orders/${id}`),

    cancelOrder: (id: number) =>
        apiClient.put(`/Orders/${id}/cancel`)
};

export default {
    authService,
    productService,
    cartService,
    orderService
}; 