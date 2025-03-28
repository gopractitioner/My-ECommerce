import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            state.error = null;
        },
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.error = null;
        },
        updateItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const item = state.items.find(item => item.productId === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
            state.error = null;
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
            state.error = null;
        },
        clearCart: (state) => {
            state.items = [];
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setCartItems,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    setLoading,
    setError,
} = cartSlice.actions;
export default cartSlice.reducer; 