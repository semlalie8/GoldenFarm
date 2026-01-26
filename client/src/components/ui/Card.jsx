import React from 'react';
import { motion } from 'framer-motion';

/**
 * Neural Card Component
 * The standard container for dashboard widgets and content areas.
 * 
 * @param {string} title - Optional title to render in header
 * @param {React.ReactNode} icon - Optional icon for the header
 * @param {React.ReactNode} action - Optional action button/link in header
 */
const Card = ({
    children,
    title,
    icon,
    action,
    className = '',
    variant = 'default',
    delay = 0
}) => {

    // index.css classes
    const baseClass = variant === 'glass' ? 'neural-status-bar flex-col items-start' : 'neural-card';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={`${baseClass} ${className}`}
        >
            {(title || icon) && (
                <div className="neural-card-header justify-between w-full">
                    <div className="flex items-center gap-4">
                        {icon && (
                            <div className="neural-card-icon icon-emerald">
                                {icon}
                            </div>
                        )}
                        {title && <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title}</h3>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="neural-card-content w-full">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
