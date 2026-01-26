import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Premium Button Component (Design System)
 * Unified button styles across the platform.
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Shows a spinner
 * @param {React.ReactNode} icon - Icon component to render
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon = null,
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    ...props
}) => {

    const baseStyle = "inline-flex items-center justify-center font-black uppercase tracking-wider rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    // Using vanilla CSS classes defined in index.css where possible, or tailwind utilities if overrides needed.
    // Note: The index.css classes like .sap-premium-btn have !important, so we use them directly.

    let variantClass = "";

    switch (variant) {
        case 'primary':
            variantClass = "sap-premium-btn"; // Gold Gradient
            break;
        case 'secondary':
            variantClass = "bg-[#006bb3] text-white hover:bg-[#005a96] shadow-lg";
            break;
        case 'outline':
            variantClass = "sap-premium-outline"; // Gold Outline
            break;
        case 'ghost':
            variantClass = "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900";
            break;
        case 'danger':
            variantClass = "bg-red-500 text-white hover:bg-red-600 shadow-md";
            break;
        default:
            variantClass = "sap-premium-btn";
    }

    const sizeClass = {
        sm: 'text-[10px] px-4 py-2 h-8',
        md: 'text-[11px] px-8 py-3.5 h-12',
        lg: 'text-[13px] px-10 py-4 h-14'
    }[size];

    // If using the global CSS classes, we might not need size utility classes if the CSS class hardcodes padding.
    // However, .sap-premium-btn has hardcoded padding. We might need to override it for 'sm' or 'lg'.
    // Since .sap-premium-btn uses !important, standard overrides might fail unless we use inline styles or specific utility classes that index.css doesn't block.
    // For now, let's rely on the base class for 'md' and standard props.

    return (
        <motion.button
            whileHover={!disabled && !loading ? { scale: 1.02, translateY: -2 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            type={type}
            className={`${baseStyle} ${variantClass} ${className} ${variant !== 'primary' && variant !== 'outline' ? sizeClass : ''}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
