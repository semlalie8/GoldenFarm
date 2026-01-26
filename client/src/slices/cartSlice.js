import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/cart');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/cart/add', { productId, quantity });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/api/cart/update', { productId, quantity });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/cart/remove/${productId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete('/api/cart/clear');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
});

export const getCartCount = createAsyncThunk('cart/getCartCount', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/cart/count');
        return data.count;
    } catch (error) {
        return rejectWithValue(0);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        itemCount: 0,
        loading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
                state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.cart?.items || [];
                state.totalAmount = action.payload.cart?.totalAmount || 0;
                state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
                state.successMessage = action.payload.message;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.cart?.items || [];
                state.totalAmount = action.payload.cart?.totalAmount || 0;
                state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.cart?.items || [];
                state.totalAmount = action.payload.cart?.totalAmount || 0;
                state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear Cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
                state.itemCount = 0;
            })
            // Get Cart Count
            .addCase(getCartCount.fulfilled, (state, action) => {
                state.itemCount = action.payload;
            });
    }
});

export const { clearError, clearSuccess } = cartSlice.actions;
export default cartSlice.reducer;
