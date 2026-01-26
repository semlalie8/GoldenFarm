import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getCartCount } from '../slices/cartSlice';

const CartIcon = ({ className = '' }) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);

    useEffect(() => {
        if (userInfo) {
            dispatch(getCartCount());
        }
    }, [dispatch, userInfo]);

    if (!userInfo) return null;

    return (
        <Link
            to="/cart"
            className={`position-relative text-decoration-none ${className}`}
            style={{ color: 'inherit' }}
        >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
                <span
                    className="position-absolute d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        backgroundColor: '#cba135',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `}
            </style>
        </Link>
    );
};

export default CartIcon;
