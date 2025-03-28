import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    attributes?: Record<string, string>;
}

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
            state.error = null;
        },
        setCurrentProduct: (state, action: PayloadAction<Product>) => {
            state.currentProduct = action.payload;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
});

export const {
    setProducts,
    setCurrentProduct,
    setLoading,
    setError,
    clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer; 