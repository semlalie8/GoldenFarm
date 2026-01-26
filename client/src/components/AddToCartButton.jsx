import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { addToCart } from '../slices/cartSlice';
import { useTranslation } from 'react-i18next';

const AddToCartButton = ({
    productId,
    stock = 99,
    variant = 'primary',
    size = 'md',
    showQuantity = false,
    className = '',
    fullWidth = false
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.cart);

    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        if (!userInfo) {
            navigate('/login?redirect=marketplace');
            return;
        }

        if (stock < 1) {
            return;
        }

        try {
            await dispatch(addToCart({ productId, quantity })).unwrap();
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error('Add to cart error:', error);
        }
    };

    const buttonStyle = {
        backgroundColor: added ? '#10b981' : '#cba135',
        border: 'none',
        transition: 'all 0.3s ease'
    };

    if (stock < 1) {
        return (
            <Button
                disabled
                variant="secondary"
                size={size}
                className={`rounded-pill ${fullWidth ? 'w-100' : ''} ${className}`}
            >
                {t('out_of_stock', 'Out of Stock')}
            </Button>
        );
    }

    return (
        <div className={`d-flex align-items-center gap-2 ${fullWidth ? 'w-100' : ''}`}>
            {showQuantity && (
                <div className="d-flex align-items-center border rounded-pill overflow-hidden">
                    <Button
                        variant="light"
                        size="sm"
                        className="border-0 rounded-0 px-3"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="px-3 fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
                        {quantity}
                    </span>
                    <Button
                        variant="light"
                        size="sm"
                        className="border-0 rounded-0 px-3"
                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                        disabled={quantity >= stock}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            )}
            <Button
                onClick={handleAddToCart}
                disabled={loading || added}
                size={size}
                className={`rounded-pill text-white fw-bold ${fullWidth && !showQuantity ? 'w-100' : ''} ${className}`}
                style={buttonStyle}
            >
                {loading ? (
                    <Spinner size="sm" animation="border" />
                ) : added ? (
                    <>
                        <Check size={18} className="me-2" />
                        {t('added', 'Added!')}
                    </>
                ) : (
                    <>
                        <ShoppingCart size={18} className="me-2" />
                        {t('add_to_cart', 'Add to Cart')}
                    </>
                )}
            </Button>
        </div>
    );
};

export default AddToCartButton;
