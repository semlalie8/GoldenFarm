import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import financeReducer from './slices/financeSlice';
import cartReducer from '../slices/cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        finance: financeReducer,
        cart: cartReducer,
    },
});

export default store;
